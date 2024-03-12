import Util from "../core/util/Util";

class InjectedScript {
  init() {
    Util.override_xhr((data: any) => {});
  }
}

const injected_script = new InjectedScript();
injected_script.init();
