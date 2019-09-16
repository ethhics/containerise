import HostStorage from '../Storage/HostStorage';

export const NO_CONTAINER = {
  name: 'No Container',
  icon: 'circle',
  iconUrl: 'resource://usercontext-content/circle.svg',
  color: 'grey',
  colorCode: '#999',
  cookieStoreId: 'no-container',
};
export const COLORS = [
  'blue',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'turquoise',
  'yellow',
];

class ContextualIdentities {

  constructor() {
    this.contextualIdentities = browser.contextualIdentities;
  }

  create(name) {
    return this.contextualIdentities.create({
      name: name,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      icon: 'circle',
    });
  }

  /**
   * Gets rid of a container and all corresponding rules
   */
  async remove(cookieStoreId) {
    if(cookieStoreId === NO_CONTAINER.cookieStoreId){
      return;
    }
    const hostMaps = await HostStorage.getAll();
    await HostStorage.remove(Object.keys(hostMaps)
        .filter(host => hostMaps[host].cookieStoreId === cookieStoreId)
    );
    return this.contextualIdentities.remove(cookieStoreId);
  }

  getAll(details = {}) {
    return this.contextualIdentities.query(details).then((identities) => [...identities, NO_CONTAINER]);
  }

  get(name) {
    if (name === NO_CONTAINER.name) {
      return Promise.resolve([NO_CONTAINER]);
    }
    return this.contextualIdentities.query({name});
  }

  addOnCreateListener(fn) {
    browser.contextualIdentities.onCreated.addListener(fn);
  }

  addOnRemoveListener(fn) {
    browser.contextualIdentities.onRemoved.addListener(fn);
  }

  addOnUpdateListener(fn) {
    browser.contextualIdentities.onUpdated.addListener(fn);
  }

  addOnChangedListener(fn) {
    this.addOnCreateListener(fn);
    this.addOnRemoveListener(fn);
    this.addOnUpdateListener(fn);
  }
}

export default new ContextualIdentities();
