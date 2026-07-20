import {render} from "preact";
import {LogosBlock} from "./component.jsx";

function renderLogosBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="logos"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<LogosBlock {...props} />, block);
    }
  });
}

renderLogosBlocks();
