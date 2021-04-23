export default {
    computed: {
        $_MarketplaceMixin_getDataLoaded() {
            return this.dataLoaded;
        }
    },

    methods: {
        $_MarketplaceMixin_setDataLoaded(flag) {
            this.dataLoaded = flag;
        }
    }
}