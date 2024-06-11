#!/usr/bin/env node
const fs = require('fs').promises;
const saveDir = './';
const filename = 'hosts';
let skipHosts = [];

async function main() {
    const configObj = JSON.parse(await fs.readFile('config.json', 'utf8'));
    if (configObj.skipHosts?.length > 0) {
        skipHosts = configObj.skipHosts;
    }
    let blacks = [];
    let whites = [];
    for (const url of configObj.blackUrls) {
        const data = await fetchData(url);
        blacks = [...blacks, ...await getListFromHosts(data, 'Block: ')];
    }
    for (const url of configObj.whiteUrls) {
        const data = await fetchData(url);
        whites = [...whites, ...await getListFromHosts(data, 'Allow: ')];
    }

    let body = '';
    if (configObj.defaultHosts?.length > 0) {
        body = configObj.defaultHosts.join('\n') + '\n'
    }
    for (const item of blacks) {
        const exists = whites.find(x => x === item);
        if (!exists) {
            body += appendIP(item) + '\n';
        }
    }

    try {
        await fs.mkdir(saveDir, { recursive: true });
        await fs.writeFile(saveDir + filename, body);
        console.log('Completed!');
    } catch (e) {
        console.log('Error:', e.stack);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (response.status == 200) {
        return await response.text();
    } else {
        throw new Error(`An error has occured: ${response.status}`);
    }
}

async function getListFromHosts(hosts, log = '') {
    const list = hosts.split('\n');
    const result = [];
    for (const item of list) {
        let line = item.trim().toLowerCase();
        if (isEmpty(line)) {
            continue;
        }
        if (line.startsWith('#')) {
            continue;
        }
        const obj = getHostObj(line);
        if (!obj.success) {
            continue;
        }
        if (result.includes(obj.hostname)) {
            continue;
        }
        if (!isEmpty(log)) {
            console.log(log + obj.hostname);
        }
        result.push(obj.hostname);
    }
    return result;
}

function appendIP(str) {
    return `0.0.0.0 ${str.trim()}`;
}

function getHostObj(str) {
    str = cleanLine(str);
    
    let flag = false;
    const arr = str.split(' ');
    // 1 only hostname
    // 2 ip and hostname
    if (arr.length !== 1 && arr.length !== 2) {
        flag = true;
    }
    if (!flag && skipHosts.find(x => str.endsWith(x))) {
        flag = true;
    }
    if (flag) {
        return { success: false, hostname: null };
    }
    const hostname = hostTrim(arr.at(arr.length === 1 ? 0 : 1));
    return { success: true, hostname };
}

function hostTrim(str) {
    return str.trim().replace(/^\.|\.$/g, '');
}

function cleanLine(str) {
    // remove comment
    let line = str.split('#')[0].trim();
    // multiple spaces to single space
    line = str.replace(/\s\s+/g, ' ');
    return line;
}

function isEmpty(str) {
    return (!str || str.length === 0);
}

const log = console.log;
console.log = (...strings) => {
    const now = (new Date()).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ');
    const dateFormat = '[' + now + '] INFO: ' + strings.shift();
    strings.unshift(dateFormat);
    log(...strings);
};

main();
