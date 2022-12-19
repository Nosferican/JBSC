---
title: "Community Formation and Detection on GitHub Collaboration Networks"
date: 2021-11-15
authors:
- Behnaz Moradi Jamei
- Brandon Lee Kramer
- admin
- Gizem Korkmaz
publication_types: ["1"]
publication: "Proceedings of the 2021 IEEE/ACM International Conference on Advances in Social Networks Analysis and Mining"
abstract:
    This paper studies community formation in OSS collaboration networks. While most current work examines the emergence of small-scale OSS projects, our approach draws on a large-scale historical dataset of 1.8 million GitHub users and their repository contributions. OSS collaborations are characterized by small groups of users that work closely together, leading to the presence of communities defined by short cycles in the underlying network structure. To understand the impact of this phenomenon, we apply a pre-processing step that accounts for the cyclic network structure by using Renewal-Nonbacktracking Random Walks (RNBRW) and the strength of pairwise collaborations before implementing the Louvain method to identify communities within the network. Equipping Louvain with RNBRW and the contribution strength provides a more assertive approach for detecting small-scale teams and reveals nontrivial differences in community detection such as users' tendencies toward preferential attachment to more established collaboration communities. Using this method, we also identify key factors that affect community formation, including the effect of users' location and primary programming language, which was determined using a comparative method of contribution activities. Overall, this paper offers several promising methodological insights for both open-source software experts and network scholars interested in studying team formation.
featured: true
doi: "10.1145/3487351.3488278"
---
