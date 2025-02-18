// // src/index.ts
// import { CashuMint, CashuWallet, getEncodedToken, getDecodedToken } from '@cashu/cashu-ts';

// export interface MintQuoteResult {
//     quote: string;
//     request: string;
// }

// export interface SendResult {
//     keep: any[];
//     send: any[];
//     cashuToken: string;
// }

// // Export all the functions
// export const initializeWallet = async (mintUrl: string) => {
//     try {
//         const mint = new CashuMint(mintUrl);
//         const wallet = new CashuWallet(mint);
//         await wallet.loadMint();
//         return wallet;
//     } catch (error) {
//         throw new Error(`Failed to initialize wallet: ${error}`);
//     }
// };

// export const createQuote = async (wallet: CashuWallet, amount: number): Promise<MintQuoteResult> => {
//     try {
//         const mintQuote = await wallet.createMintQuote(amount);
//         return mintQuote;
//     } catch (error) {
//         throw new Error(`Failed to create quote: ${error}`);
//     }
// };

// export const checkQuoteStatus = async (wallet: CashuWallet, quote: string) => {
//     try {
//         const status = await wallet.checkMintQuote(quote);
//         return status;
//     } catch (error) {
//         throw new Error(`Failed to check quote status: ${error}`);
//     }
// };

// export const mintProofs = async (wallet: CashuWallet, amount: number, quote: string) => {
//     try {
//         const proofs = await wallet.mintProofs(amount, quote);
//         return proofs;
//     } catch (error) {
//         throw new Error(`Failed to mint proofs: ${error}`);
//     }
// };

// export const sendTokens = async (wallet: CashuWallet, amount: number, proofs: any[], memo?: string): Promise<SendResult> => {
//     try {
//         await wallet.loadMint();
//         const { keep, send } = await wallet.send(amount, proofs);
        
//         if (!send || send.length === 0) {
//             throw new Error('Send operation failed or returned empty proofs.');
//         }

//         // Create token data object with optional memo
//         const tokenData: { mint: string; proofs: any[]; memo?: string } = {
//             mint: wallet.mint.mintUrl,
//             proofs: send
//         };

//         // Only add memo if it's provided
//         if (memo) {
//             tokenData.memo = memo;
//         }

//         const cashuToken = getEncodedToken(tokenData, { version: 4 });
        
//         return {
//             keep,
//             send,
//             cashuToken
//         };
//     } catch (error) {
//         throw new Error(`Failed to send tokens: ${error}`);
//     }
// };

// export const waitForPayment = async (wallet: CashuWallet, quote: string, pollInterval: number = 5000) => {
//     try {
//         let status;
//         do {
//             await new Promise(resolve => setTimeout(resolve, pollInterval));
//             status = await wallet.checkMintQuote(quote);
//         } while (status.state !== 'PAID');
//         return status;
//     } catch (error) {
//         throw new Error(`Failed while waiting for payment: ${error}`);
//     }
// };

import { CashuMint, CashuWallet, getEncodedToken, getDecodedToken } from '@cashu/cashu-ts';

/**
 * Initialize the Cashu wallet and mint
 * @param {string} mintUrl - The minting URL (e.g., 'https://mint.minibits.cash/Bitcoin')
 * @returns {CashuWallet} - Initialized CashuWallet
 */
export const initializeWallet = async (mintUrl: string): Promise<CashuWallet> => {
    const mint = new CashuMint(mintUrl);
    const wallet = new CashuWallet(mint);
    await wallet.loadMint();
    return wallet;
};

/**
 * Create a mint quote for the specified amount
 * @param {CashuWallet} wallet - Initialized CashuWallet
 * @param {number} amount - Amount to quote (in sats or desired currency)
 * @returns {Promise<any>} - The mint quote with Lightning invoice
 */
export const createQuote = async (wallet: CashuWallet, amount: number) => {
    return await wallet.createMintQuote(amount);
};

/**
 * Poll the status of a mint quote until it's paid
 * @param {CashuWallet} wallet - Initialized CashuWallet
 * @param {string} quote - Quote ID to check
 * @returns {Promise<string>} - Payment status (e.g., 'PAID')
 */
export const waitForPayment = async (wallet: CashuWallet, quote: string) => {
    let status;
    do {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 sec
        status = await wallet.checkMintQuote(quote);
        console.log('Quote Status:', status.state);
    } while (status.state !== 'PAID');
    return status.state;
};

/**
 * Fetch mint proofs
 * @param {CashuWallet} wallet - Initialized CashuWallet
 * @param {number} amount - Amount to mint
 * @param {string} quote - Quote ID for the minting process
 * @returns {Promise<any[]>} - The mint proofs
 */
export const fetchProofs = async (wallet: CashuWallet, amount: number, quote: string) => {
    return await wallet.mintProofs(amount, quote);
};

/**
 * Send minted tokens and create a sendable Cashu address
 * @param {CashuWallet} wallet - Initialized CashuWallet
 * @param {number} amount - Amount to send
 * @param {any[]} proofs - Mint proofs
 * @returns {Promise<any>} - Send operation response containing 'keep' and 'send'
 */
export const sendTokens = async (wallet: CashuWallet, amount: number, proofs: any[]) => {
    return await wallet.send(amount, proofs);
};

/**
 * Encode the proofs into a valid Cashu token (version 3)
 * @param {string} mintUrl - The minting URL (e.g., 'https://mint.minibits.cash/Bitcoin')
 * @param {any[]} proofs - Mint proofs to encode
 * @returns {string} - Encoded Cashu token
 */
export const encodeToken = (mintUrl: string, proofs: any[]) => {
    return getEncodedToken({ mint: mintUrl, proofs: proofs }, { version: 4 });
};

/**
 * Decode a Cashu token into its original form
 * @param {string} token - Encoded Cashu token
 * @returns {any} - Decoded token data
 */
export const decodeToken = (token: string) => {
    return getDecodedToken(token);
};