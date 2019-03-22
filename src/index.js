import { froalaEditor, froalaView } from "./vue-froala";

export default (Vue, Options = {}) => {
  Vue.component("Froala", froalaEditor);
  Vue.component("FroalaView", froalaView);
};

export { froalaEditor, froalaView };
