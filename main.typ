#import "metadata.typ": meta
#set document(title: meta.title, author: meta.students.values())
#set page(
  paper: "a4",
  header: { include "templates/header.typ" },
  footer: { include "templates/footer.typ" },
  margin: (
    top: 30mm,
    bottom: 20mm,
    left: 30mm,
    right: 20mm,
  ),
)
#set heading(numbering: "1.1.")
#set text(font: "LM Roman 10", lang: "vi", region: "VN")
#show raw: set text(font: "Iosevka NF")
#show raw.where(block: true): set block(fill: gray.lighten(90%), width: 100%, inset: (x: 1em, y: 1em))
#show link: it => {
  set text(fill: blue)
  underline(it)
}

#set par(leading: 1.1em)
#set figure(gap: 1em)
#show heading: it => block(inset: (top: 1em, bottom: .5em), it)

#include "templates/cover.typ"

#pagebreak()

#outline(
  title: "Mục lục",
  depth: 3,
  indent: true,
)

#outline(
  title: "Danh mục hình vẽ",
  target: figure.where(kind: image),
)

#pagebreak()
#set par(justify: true)
#show par: set block(spacing: 2em)

#include "contents/index.typ"
#include "references.typ"