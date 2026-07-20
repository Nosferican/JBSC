---
# Leave the homepage title empty to use the site title
title: ''
summary: ''
date: 2022-10-24
type: landing

sections:
  - block: resume-biography-3
    content:
      username: me
      text: ''
      headings:
        about: ''
        education: ''
        interests: ''
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle
  - block: markdown
    content:
      title: 'Research and public impact'
      subtitle: ''
      text: |-
        My work sits at the intersection of economics, public policy, and computational methods. I have developed research around official statistics, digital economy measurement, and the use of data-intensive methods to inform evidence-based decisions.

        I am especially interested in building reproducible analyses and open-source tools that make complex questions more transparent and actionable.
    design:
      columns: '1'
  - block: resume-experience
    id: experience
    content:
      username: me
    design:
      is_education_first: false
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publications
        featured_only: true
    design:
      view: citation
      columns: 2
  - block: collection
    id: talks
    content:
      title: Conferences and Talks
      filters:
        folders:
          - events
    design:
      view: citation
      columns: 2
  # - block: collection
  #   id: news
  #   content:
  #     title: Recent Posts
  #     filters:
  #       folders:
  #         - blog
  #   design:
  #     view: card
---
