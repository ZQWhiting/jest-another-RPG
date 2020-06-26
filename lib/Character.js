function Character() {}

// returns the character's health
Character.prototype.getHealth = function () {
    return `${this.name}'s health is now ${this.health}!`;
};

// checks to see if character is alive
Character.prototype.isAlive = function () {
    if (this.health === 0) {
        return false;
    }
    return true;
};

// reduces the character's health
Character.prototype.reduceHealth = function (health) {
    this.health -= health;

    if (this.health < 0) {
        this.health = 0;
    }
};

// gets the character's attack value
Character.prototype.getAttackValue = function () {
    const min = this.strength - 5;
    const max = this.strength + 5;

    return Math.floor(Math.random() * (max - min) + min);
};

module.exports = Character;