---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
showToc: true
cover:
  image: "" # image path/url
  alt: "" # alt text
  caption: "" # display caption under cover
  relative: false # when using page bundles set this to true
  hidden: false # only when true, image will not be shown is Both Single and List
  hiddenInList: false # only when true, image will not be shown in List
  hiddenInSingle: true # only when true, image will not be shown in Single
---
