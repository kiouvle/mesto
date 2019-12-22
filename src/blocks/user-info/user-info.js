//class for cards
export default class UserInfo {
    constructor(container, name, job, avatarUrl) {
        this._container = container;
        this._name = name;
        this._job = job;
        this._avatarUrl = avatarUrl;

        this._userNameElement = container.querySelector('.user-info__name');
        this._userJobElement = container.querySelector('.user-info__job');
        this._userAvatarElement = container.querySelector('.user-info__photo');
    }

    updateData(name, job, avatarUrl) {
        this._name = name;
        this._job = job;

        this._userNameElement.textContent = this._name;
        this._userJobElement.textContent = this._job;

        if (avatarUrl) {
            this._avatarUrl = avatarUrl;
            this._userAvatarElement.setAttribute('style', 'background-image: url(' + this._avatarUrl + ')');
        }
    }

    getData() {
        return { name: this._name, job: this._job, avatarUrl: this._avatarUrl };
    }
}