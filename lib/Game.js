const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

class Game {
    constructor() {
        this.roundNumber = 0;
        this.isPlayerTurn = false;
        this.enemies = [];
        this.currentEnemy;
        this.player;
    }
    initializeGame() {
        this.enemies.push(new Enemy('goblin', 'sword'));
        this.enemies.push(new Enemy('orc', 'baseball bat'));
        this.enemies.push(new Enemy('skeleton', 'axe'));

        this.currentEnemy = this.enemies[0];

        inquirer
            .prompt({
                type: 'text',
                name: 'name',
                message: 'What is your name?'
            })
            .then(({ name }) => {
                this.player = new Player(name);

                this.startNewBattle();
            });
    }
    startNewBattle() {
        if (this.player.agility > this.currentEnemy.agility) {
            this.isPlayerTurn = true;
        }
        else {
            this.isPlayerTurn = false;
        }

        console.log('Your stats are as follows:');
        console.table(this.player.getStats());
        console.log(this.currentEnemy.getDescription());

        this.battle();
    }
    battle() {
        //IF player turn
        if (this.isPlayerTurn) {
            //prompt user to attack or use a potion
            inquirer
                .prompt({
                    type: 'list',
                    message: 'What would you like to do?',
                    name: 'action',
                    choices: ['Attack', 'Use potion']
                })
                .then(({ action }) => {
                    //IF using a potion
                    if (action === 'Use potion') {
                        // IF player has no potions, alert and stop player turn
                        if (!this.player.getInventory()) {
                            console.log("You don't have any potions!");

                            return this.checkEndOfBattle();
                        }

                        // display list of potion objects to user
                        inquirer
                            .prompt({
                                type: 'list',
                                message: 'Which potion would you like to use?',
                                name: 'action',
                                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                            })
                            // apply selected potion effect to player
                            .then(({ action }) => {
                                const [potionIndex, potionName] = action.split(': ');

                                this.player.usePotion(potionIndex - 1);
                                console.log(`You used a ${potionName} potion.`);

                                this.checkEndOfBattle();
                            });

                        // ELSE IF attacking
                    }
                    else {
                        // subtract health from the enemy based on player attack value
                        const damage = this.player.getAttackValue();
                        this.currentEnemy.reduceHealth(damage);

                        console.log(`You attacked the ${this.currentEnemy.name}`);
                        console.log(this.currentEnemy.getHealth());

                        this.checkEndOfBattle();
                    }
                });
            // ELSE IF enemy turn
        }
        else {
            // subtract health form the player based on enemy attack value
            const damage = this.currentEnemy.getAttackValue();
            this.player.reduceHealth(damage);

            console.log(`You were attacked by the ${this.currentEnemy.name}`);
            console.log(this.player.getHealth());

            this.checkEndOfBattle();
        }
    }
    checkEndOfBattle() {
        if (this.player.isAlive() && this.currentEnemy.isAlive()) {
            this.isPlayerTurn = !this.isPlayerTurn;
            this.battle();
        }
        else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
            console.log(`You've defeated the ${this.currentEnemy.name}`);

            this.player.addPotion(this.currentEnemy.potion);
            console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

            this.roundNumber++;

            if (this.roundNumber < this.enemies.length) {
                this.currentEnemy = this.enemies[this.roundNumber];
                this.startNewBattle();
            }
            else {
                console.log('You win!');
            }
        }
        else {
            console.log("You've been defeated!");
        }
    }
}




module.exports = Game;