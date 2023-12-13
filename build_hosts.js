#!/usr/bin/env node
const fs = require('fs').promises;
const regexIp = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)', 'i');
const saveDir = './';
const filename = 'hosts';

async function main() {
    const configObj = JSON.parse(await fs.readFile('config.json', 'utf8'));
    let blacks = [];
    let whites = [];
    for (const url of configObj.blackUrls) {
        const data = await fetchData(url);
        blacks = [...blacks, ...strToArray(data)];
    }
    for (const url of configObj.whiteUrls) {
        const data = await fetchData(url);
        whites = [...whites, ...strToArray(data, false)];
    }
    blacks = blacks.filter((el) => !whites.find(x => el.endsWith(x)));
    try {
        await fs.mkdir(saveDir, { recursive: true });
        await fs.writeFile(saveDir + filename, blacks.join('\n'));
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

function strToArray(str, trimIp = false) {
    const array = str.split('\n');
    const newArray = [];
    for (const item of array) {
        if (item.startsWith('#')) {
            continue;
        }
        let hostname = item.split('#')[0].trim().toLowerCase();
        if (hostname === null || hostname === '') {
            continue;
        }
        if (trimIp && hasIP(hostname)) {
            hostname = removeIP(hostname);
        }
        if (!trimIp && !hasIP(hostname)) {
            hostname = appendIP(hostname);
        }
        if (hostname.endsWith('0.0.0.0') || hostname.endsWith('127.0.0.1')) {
            continue;
        }
        if (newArray.includes(hostname)) {
            continue;
        }
        newArray.push(hostname.replace(/^\./, ''));
    }
    return newArray;
}

function hasIP(ipaddress) {
    return regexIp.test(ipaddress) ? true : false;
}

function removeIP(str) {
    return str.replace(regexIp, '').trim();
}

function appendIP(str) {
    return `0.0.0.0 ${str.trim()}`;
}

main();
