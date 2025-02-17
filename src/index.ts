// src/index.ts
import { CashuMint, CashuWallet, getEncodedToken, getDecodedToken } from '@cashu/cashu-ts';

export interface MintQuoteResult {
    quote: string;
    request: string;
}

export interface SendResult {
    keep: any[];
    send: any[];
    cashuToken: string;
}

// Export all the functions
export const initializeWallet = async (mintUrl: string) => {
    try {
        const mint = new CashuMint(mintUrl);
        const wallet = new CashuWallet(mint);
        await wallet.loadMint();
        return wallet;
    } catch (error) {
        throw new Error(`Failed to initialize wallet: ${error}`);
    }
};

export const createQuote = async (wallet: CashuWallet, amount: number): Promise<MintQuoteResult> => {
    try {
        const mintQuote = await wallet.createMintQuote(amount);
        return mintQuote;
    } catch (error) {
        throw new Error(`Failed to create quote: ${error}`);
    }
};

export const checkQuoteStatus = async (wallet: CashuWallet, quote: string) => {
    try {
        const status = await wallet.checkMintQuote(quote);
        return status;
    } catch (error) {
        throw new Error(`Failed to check quote status: ${error}`);
    }
};

export const mintProofs = async (wallet: CashuWallet, amount: number, quote: string) => {
    try {
        const proofs = await wallet.mintProofs(amount, quote);
        return proofs;
    } catch (error) {
        throw new Error(`Failed to mint proofs: ${error}`);
    }
};

export const sendTokens = async (wallet: CashuWallet, amount: number, proofs: any[], memo?: string): Promise<SendResult> => {
    try {
        await wallet.loadMint();
        const { keep, send } = await wallet.send(amount, proofs);
        
        if (!send || send.length === 0) {
            throw new Error('Send operation failed or returned empty proofs.');
        }

        // Create token data object with optional memo
        const tokenData: { mint: string; proofs: any[]; memo?: string } = {
            mint: wallet.mint.mintUrl,
            proofs: send
        };

        // Only add memo if it's provided
        if (memo) {
            tokenData.memo = memo;
        }

        const cashuToken = getEncodedToken(tokenData, { version: 4 });
        
        return {
            keep,
            send,
            cashuToken
        };
    } catch (error) {
        throw new Error(`Failed to send tokens: ${error}`);
    }
};

export const waitForPayment = async (wallet: CashuWallet, quote: string, pollInterval: number = 5000) => {
    try {
        let status;
        do {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            status = await wallet.checkMintQuote(quote);
        } while (status.state !== 'PAID');
        return status;
    } catch (error) {
        throw new Error(`Failed while waiting for payment: ${error}`);
    }
};