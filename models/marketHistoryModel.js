function MarketHistory(tier = 4, type ='', enchantment = '', date ='', locations = '',time_scale=24) {
    this.tier = tier;
    this.type = type;
    this.enchantment = enchantment;
    this.date = date;
    this.locations = locations;
    this.time_scale = time_scale;
}

// Adding a method to the constructor
MarketHistory.prototype.getItemId = function() {
    return `T${this.tier}${this.type}${this.enchantment}`;
}