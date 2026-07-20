import {render} from "preact";
import {GalleryBlock} from "./component.jsx";

function renderGalleryBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="gallery"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<GalleryBlock {...props} />, block);
    }
  });
}

renderGalleryBlocks();
