---
title: "Accelerated Predictive Healthcare Analytics with Pumas, A High Performance Pharmaceutical Modeling and Simulation Platform"
authors:
- Chris Rackauckas
- Yingbo Ma
- Andreas Noack
- Vaibhav Dixit
- Patrick Kofod Mogensen
- Chris Elrod
- Mohammad Tarek
- Simon Byrne
- Shubham Maddhashiya
- admin
- Michael Hatherly
- Joakim Nyberg
- Jogarao V.S. Gobburu
- Vijay Ivaturi
# author_notes:
date: "2022-03-20T00:00:00Z"
doi: "10.1101/2020.11.28.402297"

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
# publication_types: ["3"]

# Publication name and optional abbreviated publication name.
publication: "bioRxiv New Results"
# publication_short: "This here"

abstract:
    Pharmacometric modeling establishes causal quantitative relationships between administered dose, tissue exposures, desired and undesired effects and patient’s risk factors. These models are employed to de-risk drug development and guide precision medicine decisions. However, pharmacometric tools have not been designed to handle today’s heterogeneous big data and complex models. We set out to design a platform that facilitates domain-specific modeling and its integration with modern analytics to foster innovation and readiness in healthcare.

    Pumas demonstrates estimation methodologies with dramatic performance advances. New ODE solver algorithms, such as coeficient-optimized higher order integrators and new automatic stiffness detecting algorithms which are robust to frequent discontinuities, give rise to a median 4x performance improvement across a wide range of stiff and non-stiff systems seen in pharmacometric applications. These methods combine with JIT compiler techniques, such as statically-sized optimizations and discrete sensitivity analysis via forward-mode automatic differentiation, to further enhance the accuracy and performance of the solving and parameter estimation process. We demonstrate that when all of these techniques are combined with a validated clinical trial dosing mechanism and non-compartmental analysis (NCA) suite, real applications like NLME fitting see a median 81x acceleration while retaining the same accuracy. Meanwhile in areas with less prior software optimization, like optimal experimental design, we see orders of magnitude performance enhancements over competitors. Further, Pumas combines these technical advances with several workflows that are automated and designed to boost productivity of the day-to-day user activity. Together we show a fast pharmacometric modeling framework for next-generation precision analytics.

# Summary. An optional shortened abstract.
summary:

# tags:
# - Source Themes
featured: true

# links:
# - name: ""
#   url: ""
url_pdf: "https://doi.org/10.1101/2020.11.28.402297" 
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
# image:
#   caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
#   focal_point: ""
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: example
---
