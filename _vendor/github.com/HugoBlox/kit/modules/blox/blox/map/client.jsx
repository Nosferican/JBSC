import {render} from "preact";
import {MapBlock} from "./component.jsx";

function renderMapBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="map"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<MapBlock {...props} />, block);
    }
  });
}

renderMapBlocks();
