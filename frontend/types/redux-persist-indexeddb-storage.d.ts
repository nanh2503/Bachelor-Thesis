declare module 'redux-persist-indexeddb-storage' {
    import { Storage } from 'redux-persist';

    interface IndexedDBConfig {
        name?: string;
        storeName?: string;
        version?: number;
    }

    export default function createIndexedDBStorage(config?: IndexedDBConfig): Storage;
}
