import { ethers } from "ethers"

/**
 * Storage
 *
 * Use local storage - yes this means that the depositor and arbiter need to use the same
 * web browser :), but this is a proof of concept.  The adaption to a server with REST API
 * is an easy adaption of this but is non-trivial.
 *
 * Store a stringified array of JSON representing the completed Authorised Escrow jobs.
 *
 */

const key = 'escrows';
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

/**
 * Store passed escrow in storage as an object keyed by address
 * @param escrow
 */
export const store = (escrow) => {
    // let escrows64 = window.localStorage.getItem(key)
    let escrows = read();
    // if (escrows64) {
    //     const escrowsText = ethers.utils.base64.decode(escrows64);
    //     escrows = JSON.parse(escrowsText);
    //     console.log(`Read Escrows from storage: ${JSON.stringify(escrows)}`);
    //     console.log(`  size is: ${escrows.length}`)
    // } else {
    //     console.log(`The escrows storage is currently empty.`)
    // }
    // Don't want the approve function as won't stringify
    /*
    escrow.handleApprove = null;
    const escrowString = JSON.stringify(escrow);
    const escrowBytes = utf8Encoder.encode(escrowString);
    // const escrow64 = ethers.utils.base64.encode(escrowBytes);
    console.log(`  UTF8 Escrow to store: ${escrowBytes}`);
    escrows.push(escrowBytes);
    console.log(`Prepare escrows for storage: ${JSON.stringify(escrows)}`);
    console.log(`  size is: ${escrows.length}`)

    const escrowsString = JSON.stringify(escrow);
    const escrowsBytes = utf8Encoder.encode(escrowsString);

    // const escrows64 = ethers.utils.base64.encode(JSON.stringify(escrows));
    window.localStorage.setItem(key, escrowsBytes);
    */
    const escrowsObj = read();
    // Don't want the approve function as won't stringify
    // escrow.handleApprove = null;
    escrowsObj[escrow.address] = escrow;
    const escrowsString = JSON.stringify(escrowsObj);
    window.localStorage.setItem(key, escrowsString);
    console.log(`Stored escrow in array - size now: ${Object.keys(escrowsObj).length}`)
}

/**
 * Read escrows from storage
 * @returns array of escrows (JSON)
 */
export const read = () => {
    /*
    const escrowsBytes = window.localStorage.getItem(key)
    const escrowUTF8 = new Uint8Array(escrowsBytes);
    if (escrowsBytes) {
        // const escrowsText = ethers.utils.base64.decode(escrows64);
        const escrowsText = utf8Decoder.decode(escrowUTF8);
        const escrows = JSON.parse(escrowsText);
        console.log(`Read Escrows from storage: ${JSON.stringify(escrows)}`);
        console.log(`  size is: ${escrows.length}`)
        return escrows;
    } else {
        console.log(`The escrows storage is currently empty.`)
        return [];
    }
    */
    const jsonString = window.localStorage.getItem(key);
    if (jsonString) {
        const escrowsObj = JSON.parse(jsonString);
        // console.log(`Read Escrows from storage: ${JSON.stringify(escrowsObj)}`);
        // console.log(`  size is: ${Object.keys(escrowsObj).length}`)
        return escrowsObj;
    } else {
        console.log(`The escrows storage is currently empty.`)
        return {};
    }
}
