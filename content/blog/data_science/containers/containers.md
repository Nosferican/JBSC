---
title: OS-level virtualization systems
linktitle: Containers
toc: true
type: docs
draft: false
date: "2019-11-10"
lastmod: "2021-05-04"
menu:
  data_science:
    weight: 2

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
# weight: 2
---

OS-level virtualization is a key feature of data science. The idea is to have a contained environment that provides functionality, security, and replicability.

For single machines one of the best implementations of OS-level virtualization is [Docker](https://www.docker.com/). However, in multi-user systems such a high-performance computing (HPC), the preferred solution is [Singularity](https://sylabs.io/).

[{{< figure src="icons/brands/docker.svg" alt="Docker: Moby Dock whale logo" width="200em">}}](https://www.docker.com)
