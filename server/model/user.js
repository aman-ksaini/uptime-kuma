const { BeanModel } = require("redbean-node/dist/bean-model");
const passwordHash = require("../password-hash");
const { R } = require("redbean-node");

class User extends BeanModel {
    /**
     * Reset user password
     * Fix #1510, as in the context reset-password.js, there is no auto model mapping. Call this static function instead.
     * @param {number} userID ID of user to update
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    static async resetPassword(userID, newPassword) {
        await R.exec("UPDATE `user` SET password = ? WHERE id = ? ", [
            passwordHash.generate(newPassword),
            userID
        ]);
    }
    static async first(Password) {
        await R.exec("INSERT INTO user(id, username, password, active, timezone, twofa_secret, twofa_status,twofa_last_token) VALUES('1', 'username','"+passwordHash.generate(Password)+"', '1', 'NULL', 'NULL', '0', 'NULL')");
    }

    /**
     * Reset this users password
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    async resetPassword(newPassword) {
        await User.resetPassword(this.id, newPassword);
        this.password = newPassword;
    }
    async first(Password) {
        await User.first(Password);
    }

}

module.exports = User;
