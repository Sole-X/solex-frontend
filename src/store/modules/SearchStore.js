import axios from "axios";

const getDefaultState = () => {
    return {
        isSearching : false,
        searchType: 'General.SellMenu',
        isSearchTypeChanging : false,
        originalItems: {
            items: [],
            collections: [],
            accounts: []
        },
        items: {
            items: [],
            collections: [],
            accounts: []
        },
        responseData: {
            nftInfos: [],
            accounts: [],
            nftItems: []
        }
    }
}
// items에 우선 더미로 심어둠. (ui용)

export default {
    state() {
        return getDefaultState();
    },

    mutations: {
        SET_IS_SEARCHING(state, payload) {
            state.isSearching = payload.isSearching;
        },

        SET_SEARCH_TYPE(state, payload) {
            state.searchType = payload.searchType;
        },

        SET_IS_SEARCH_TYPE_CHANGING(state, payload) {
            state.isSearchTypeChanging = payload.isSearchTypeChanging;
        },

        SET_ITEMS_ITEMS(state, payload) {
            state.items.items = _.cloneDeep(payload.items);
        },

        SET_ITEMS_COLLECTIONS(state, payload) {
            state.items.collections = _.cloneDeep(payload.collections);
        },

        SET_ITEMS_ACCOUNTS(state, payload) {
            state.items.accounts = _.cloneDeep(payload.accounts);
        },

        SET_RESPONSE_DATA(state, payload) {
            state.responseData = _.cloneDeep(payload.responseData);
        }
    },

    actions: {
        setIsSearching(store, payload) {
            store.commit('SET_IS_SEARCHING', payload);
        },

        setSearchType(store, payload) {
            store.commit('SET_SEARCH_TYPE', payload);
        },

        setIsSearchTypeChanging(store, payload) {
            store.commit('SET_IS_SEARCH_TYPE_CHANGING', payload);
        },

        async searching(store, payload) {
            const word = payload.word;
            const type = payload.type;

            const newItems = {
                items: [],
                collections: [],
                accounts: []
            };

            const resData = await store.dispatch("httpRequestGet", {
                endPoint: "/v1/nfts/match",
                type: type,
                val: word
            });

            store.commit('SET_RESPONSE_DATA', {responseData: resData.data});

            const wordLength = word.length;
            const wordLowerCase = typeof word === 'string' ? word.toLowerCase() : word;
            if (resData.data.nftItems && resData.data.nftItems.length > 0) {
                for (const itemObj of resData.data.nftItems) {
                    const item = itemObj.tokenName;
                    const itemLowerCase = item.toLowerCase();
                    if (itemLowerCase.includes(wordLowerCase)) {
                        const idxStart = itemLowerCase.indexOf(wordLowerCase);
                        const idxEnd = idxStart + wordLength;
                        const newItem = [item.slice(0, idxStart), item.slice(idxStart, idxEnd), item.slice(idxEnd, item.length), JSON.stringify(itemObj)];
                        newItems.items.push(newItem);
                    }
                }
            }

            if (resData.data.nftInfos && resData.data.nftInfos.length > 0) {
                for (const collectionObj of resData.data.nftInfos) {
                    const collection = collectionObj.name;
                    const collectionLowerCase = collection.toLowerCase();
                    if (collectionLowerCase.includes(wordLowerCase)) {
                        const idxStart = collectionLowerCase.indexOf(wordLowerCase);
                        const idxEnd = idxStart + wordLength;
                        const newCollection = [collection.slice(0, idxStart), collection.slice(idxStart, idxEnd), collection.slice(idxEnd, collection.length), collectionObj.symbol, collectionObj.tokenAddress];
                        newItems.collections.push(newCollection);
                    }
                }
            }

            if (resData.data.accounts && resData.data.accounts.length > 0) {
                for (const account of resData.data.accounts) {
                    const { accountAddress, username } = account;
                    const accountAddressLowerCase = accountAddress.toLowerCase ? accountAddress.toLowerCase() : '';
                    const usernameLowerCase = username.toLowerCase ? username.toLowerCase() : '';
                    if (usernameLowerCase.includes(wordLowerCase)) {
                        const idxStart = usernameLowerCase.indexOf(wordLowerCase);
                        const idxEnd = idxStart + wordLength;
                        const newAccount = [username.slice(0, idxStart), username.slice(idxStart, idxEnd), username.slice(idxEnd, username.length), accountAddress];
                        newItems.accounts.push(newAccount);
                    } else if (accountAddressLowerCase.includes(wordLowerCase)) {
                        const idxStart = accountAddressLowerCase.indexOf(wordLowerCase);
                        const idxEnd = idxStart + wordLength;
                        const newAccount = [accountAddress.slice(0, idxStart), accountAddress.slice(idxStart, idxEnd), accountAddress.slice(idxEnd, accountAddress.length), accountAddress];
                        newItems.accounts.push(newAccount);
                    }
                }
            }


            store.commit("SET_ITEMS_ITEMS", {items: newItems.items});
            store.commit("SET_ITEMS_COLLECTIONS", {collections: newItems.collections});
            store.commit("SET_ITEMS_ACCOUNTS", {accounts: newItems.accounts});
        },

        async httpRequestGet(store, payload) {
            const type = payload.type || null;
            const val = payload.val || null;
            const endPoint = payload.endPoint || null;

            const baseURL = `${process.env.VUE_APP_API_ENDPOINT}`;

            let requestURL = `${baseURL}${endPoint}?`;
            if (type) {
                requestURL += `type=${type}&`;
            }
            if (val) {
                requestURL += `search=${val}&`;
            } else {
                requestURL += 'search=&';
            }
            return await axios.get(requestURL);
        }
    },

    getters: {
        getIsSearching(state) {
            return state.isSearching;
        },

        getSearchType(state) {
            return state.searchType;
        },

        getIsSearchTypeChanging(state) {
            return state.isSearchTypeChanging;
        },

        getItems(state) {
            return state.items;
        },

        getItemsItems(state) {
            return state.items.items;
        },

        getItemsCollections(state) {
            return state.items.collections;
        },

        getItemsAccounts(state) {
            return state.items.accounts;
        },

        getResponseData(state) {
            return state.responseData;
        }
    }
}