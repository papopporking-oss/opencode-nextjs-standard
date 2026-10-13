import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
# Strong Markdown Example

This is a **Strong Markdown Theme** example using Next.js,
Tailwind CSS, and DaisyUI.

## 1. Introduction

Markdown supports multiple formatting options, including:

- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- [External links](https://nextjs.org)
- Inline code: \`const app = "Next.js"\`

## 2. Features

| Feature | Description | Status |
|:---|:---|:---:|
| Headings | H1 - H6 | Done |
| Tables | GitHub Flavored Markdown | Done |
| Code Block | Syntax formatting | Done |
| Blockquote | Highlight important text | Done |
| Lists | Ordered and unordered | Done |

## 3. Code Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

console.log(user);
\`\`\`

## 4. Blockquote

> Good software is built with a strong architecture,
> clear documentation, and maintainable code.

## 5. Ordered List

1. Install dependencies.
2. Configure Tailwind CSS.
3. Create Markdown component.
4. Render Markdown content.

## 6. Task List

- [x] Setup Next.js
- [x] Install Markdown renderer
- [x] Configure GFM support
- [ ] Implement Markdown API
- [ ] Deploy production

## 7. Important Information

**Warning:** Always validate and sanitize untrusted content
when rendering Markdown, especially if allowing embedded HTML.

---

**Conclusion:** Markdown can be rendered as rich content
without using a dedicated documentation framework.
`;

export default function Page() {
  return (
    <main className="w-full flex-1 bg-base-300">
      
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-2 m-2">

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <article className="prose lg:prose-xl">
              <h1>Garlic bread with cheese: What the science tells us</h1>
              <p>
                For years parents have espoused the health benefits of eating garlic bread with cheese to their
                children, with the food earning such an iconic status in our culture that kids will often dress
                up as warm, cheesy loaf for Halloween.
              </p>
              <p>
                But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
                springing up around the country.
              </p>
            </article>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <article
              className="
                prose prose-lg max-w-none
                prose-headings:font-extrabold
                prose-headings:tracking-tight
                prose-h1:text-4xl
                prose-h2:text-2xl
                prose-h3:text-xl
                prose-p:leading-8
                prose-strong:font-extrabold
                prose-a:text-primary
                prose-a:no-underline
                hover:prose-a:underline
                prose-blockquote:border-l-primary
                prose-blockquote:bg-base-200
                prose-blockquote:rounded-r-lg
                prose-blockquote:px-5
                prose-blockquote:py-2
                prose-table:border-collapse
                prose-th:bg-base-200
                prose-th:p-3
                prose-td:p-3
                prose-pre:bg-neutral
                prose-pre:text-neutral-content
                prose-code:text-primary
                prose-hr:border-base-300
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </article>

          </div>
        </div>

      </div>

    </main>
  );
}
