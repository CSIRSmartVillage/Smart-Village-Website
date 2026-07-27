const containerClass =
  "mx-auto max-w-4xl space-y-6 text-gray-700 tracking-normal";

const renderInline = (text = "", keyPrefix = "inline") => {
  const parts = String(text).split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g
  );

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong
          key={key}
          className="font-semibold text-slate-900"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={key}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <em key={key}>
          {part.slice(1, -1)}
        </em>
      );
    }

    const markdownLink = part.match(
      /^\[([^\]]+)\]\(([^)]+)\)$/
    );

    if (markdownLink) {
      return (
        <a
          key={key}
          href={markdownLink[2]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 underline-offset-4 hover:underline"
        >
          {markdownLink[1]}
        </a>
      );
    }

    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={key}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 underline-offset-4 hover:underline"
        >
          {part}
        </a>
      );
    }

    return part;
  });
};

const normalizeText = (value = "") =>
  String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/â€¢/g, "•")
    .replace(/([^\n])[ \t]+(?=\d+\.\s)/g, "$1\n")
    .replace(/([^\n])[ \t]+(?=•\s)/g, "$1\n")
    .replace(/([^\n])[ \t]+(?=-\s)/g, "$1\n");

const getListMatch = (line = "") =>
  line.match(/^(\s*)([-•]|\d+\.)\s+(.+)$/);

const getNumberedMatch = (line = "") =>
  line.match(/^\s*(\d+)\.\s+(.+)$/);

const buildListTree = (lines, startIndex) => {
  const root = {
    level: -1,
    children: [],
  };
  const stack = [root];
  let index = startIndex;

  while (index < lines.length) {
    const match = getListMatch(lines[index]);

    if (!match) break;

    const level = Math.floor(
      match[1].replace(/\t/g, "  ").length / 2
    );
    const item = {
      level,
      type: /^\d+\./.test(match[2]) ? "ol" : "ul",
      text: match[3],
      children: [],
    };

    while (
      stack.length > 1 &&
      stack[stack.length - 1].level >= level
    ) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(item);
    stack.push(item);
    index += 1;
  }

  return {
    items: root.children,
    nextIndex: index,
  };
};

const renderListGroup = (
  items,
  type = "ul",
  keyPrefix = "list"
) => {
  const Tag = type;

  return (
    <Tag
      className={`mb-6 space-y-3 pl-8 text-left text-base leading-8 text-gray-700 sm:text-[17px] lg:text-lg ${
        type === "ol" ? "list-decimal" : "list-disc"
      }`}
    >
      {items.map((item, index) => {
        const childGroups = item.children.reduce(
          (groups, child) => {
            const last = groups[groups.length - 1];

            if (!last || last.type !== child.type) {
              groups.push({
                type: child.type,
                items: [child],
              });
            } else {
              last.items.push(child);
            }

            return groups;
          },
          []
        );

        return (
          <li key={`${keyPrefix}-${index}`}>
            {renderInline(
              item.text,
              `${keyPrefix}-${index}`
            )}

            {childGroups.map((group, groupIndex) => (
              <div
                key={`${keyPrefix}-${index}-${groupIndex}`}
                className="mt-3"
              >
                {renderListGroup(
                  group.items,
                  group.type,
                  `${keyPrefix}-${index}-${groupIndex}`
                )}
              </div>
            ))}
          </li>
        );
      })}
    </Tag>
  );
};

const parseLooseNumberedSections = (lines, startIndex) => {
  const sections = [];
  let index = startIndex;

  while (index < lines.length) {
    const numberedMatch = getNumberedMatch(lines[index]);

    if (!numberedMatch) break;

    const title = numberedMatch[2].trim();
    const bodyLines = [];
    index += 1;

    while (index < lines.length && !lines[index].trim()) {
      index += 1;
    }

    while (
      index < lines.length &&
      !getNumberedMatch(lines[index]) &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^---+$/.test(lines[index].trim()) &&
      !/^```/.test(lines[index].trim()) &&
      !(
        lines[index].trim().startsWith("|") &&
        lines[index].trim().endsWith("|")
      )
    ) {
      if (lines[index].trim()) {
        bodyLines.push(lines[index].trim());
      }

      index += 1;
    }

    if (bodyLines.length === 0) {
      return null;
    }

    sections.push({
      title,
      body: bodyLines.join(" "),
    });

    while (index < lines.length && !lines[index].trim()) {
      index += 1;
    }
  }

  if (sections.length < 2) {
    return null;
  }

  return {
    sections,
    nextIndex: index,
  };
};

const parseTable = (lines, startIndex) => {
  const tableLines = [];
  let index = startIndex;

  while (
    index < lines.length &&
    lines[index].trim().startsWith("|") &&
    lines[index].trim().endsWith("|")
  ) {
    tableLines.push(lines[index].trim());
    index += 1;
  }

  if (tableLines.length < 2) {
    return null;
  }

  const separator = tableLines[1]
    .replace(/\|/g, "")
    .trim();

  if (!/^:?-{3,}:?(\s*:?-{3,}:?)*$/.test(separator)) {
    return null;
  }

  const rows = tableLines.map((line) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  return {
    rows,
    nextIndex: index,
  };
};

const SmartTextRenderer = ({
  text = "",
  className = "",
}) => {
  if (!String(text).trim()) return null;

  const lines = normalizeText(text).split("\n");
  const elements = [];
  let index = 0;

  const pushParagraph = (paragraphLines) => {
    const paragraph = paragraphLines
      .join(" ")
      .trim();

    if (!paragraph) return;

    elements.push(
      <p
        key={`p-${elements.length}`}
        className="mb-6 text-base leading-8 text-gray-700 text-left sm:text-[17px] lg:text-lg lg:text-justify"
      >
        {renderInline(
          paragraph,
          `p-${elements.length}`
        )}
      </p>
    );
  };

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const table = parseTable(lines, index);

    if (table) {
      const [headers, , ...bodyRows] = table.rows;

      elements.push(
        <div
          key={`table-${elements.length}`}
          className="my-8 overflow-x-auto rounded-xl border border-slate-200"
        >
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-800">
              <tr>
                {headers.map((header, cellIndex) => (
                  <th
                    key={cellIndex}
                    className="px-4 py-3 font-semibold"
                  >
                    {renderInline(header, `th-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 leading-7 text-slate-700"
                    >
                      {renderInline(
                        cell,
                        `td-${rowIndex}-${cellIndex}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      index = table.nextIndex;
      continue;
    }

    if (/^---+$/.test(line)) {
      elements.push(
        <hr
          key={`hr-${elements.length}`}
          className="my-10 border-slate-200"
        />
      );
      index += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const codeLines = [];
      index += 1;

      while (
        index < lines.length &&
        !/^```/.test(lines[index].trim())
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="my-8 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const heading = line.match(
      /^(#{1,3})\s+(.+)$/
    );

    if (heading) {
      const level = heading[1].length;
      const content = renderInline(
        heading[2],
        `h-${elements.length}`
      );

      if (level === 1) {
        elements.push(
          <h1
            key={`h1-${elements.length}`}
            className="mb-8 text-4xl font-bold leading-tight text-slate-950"
          >
            {content}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2
            key={`h2-${elements.length}`}
            className="mb-5 mt-12 text-3xl font-semibold leading-tight text-slate-900"
          >
            {content}
          </h2>
        );
      } else {
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            className="mb-4 mt-8 text-2xl font-semibold leading-snug text-slate-900"
          >
            {content}
          </h3>
        );
      }

      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];

      while (
        index < lines.length &&
        /^>\s?/.test(lines[index].trim())
      ) {
        quoteLines.push(
          lines[index].trim().replace(/^>\s?/, "")
        );
        index += 1;
      }

      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-8 border-l-4 border-blue-700 bg-blue-50/70 px-6 py-4 italic leading-8 text-slate-700"
        >
          {renderInline(
            quoteLines.join(" "),
            `quote-${elements.length}`
          )}
        </blockquote>
      );
      continue;
    }

    const looseNumberedSections =
      parseLooseNumberedSections(lines, index);

    if (looseNumberedSections) {
      elements.push(
        <ol
          key={`loose-ol-${elements.length}`}
          className="my-8 space-y-8 text-left"
        >
          {looseNumberedSections.sections.map((section, sectionIndex) => (
            <li
              key={`loose-ol-${elements.length}-${sectionIndex}`}
              className="grid gap-4 rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm sm:grid-cols-[3rem_1fr]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-base font-bold text-white">
                {sectionIndex + 1}
              </span>

              <div>
                <h3 className="text-xl font-semibold leading-snug text-slate-900">
                  {renderInline(
                    section.title,
                    `loose-title-${elements.length}-${sectionIndex}`
                  )}
                </h3>

                <p className="mt-3 text-base leading-8 text-gray-700 sm:text-[17px] lg:text-lg">
                  {renderInline(
                    section.body,
                    `loose-body-${elements.length}-${sectionIndex}`
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

      index = looseNumberedSections.nextIndex;
      continue;
    }

    if (getListMatch(lines[index])) {
      const listTree = buildListTree(lines, index);
      const groupedLists = listTree.items.reduce(
        (groups, item) => {
          const last = groups[groups.length - 1];

          if (!last || last.type !== item.type) {
            groups.push({
              type: item.type,
              items: [item],
            });
          } else {
            last.items.push(item);
          }

          return groups;
        },
        []
      );

      groupedLists.forEach((group, groupIndex) => {
        elements.push(
          <div key={`list-${elements.length}-${groupIndex}`}>
            {renderListGroup(
              group.items,
              group.type,
              `list-${elements.length}-${groupIndex}`
            )}
          </div>
        );
      });

      index = listTree.nextIndex;
      continue;
    }

    if (/!\[[^\]]*\]\([^)]+\)/.test(line)) {
      const image = line.match(
        /!\[([^\]]*)\]\(([^)]+)\)/
      );

      elements.push(
        <img
          key={`img-${elements.length}`}
          src={image[2]}
          alt={image[1]}
          decoding="async"
          fetchPriority="low"
          loading="lazy"
          className="my-8 rounded-xl shadow-md"
        />
      );
      index += 1;
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !getListMatch(lines[index]) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^---+$/.test(lines[index].trim()) &&
      !(
        lines[index].trim().startsWith("|") &&
        lines[index].trim().endsWith("|")
      )
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    pushParagraph(paragraphLines);
  }

  return (
    <div
      className={`${containerClass} ${className}`}
    >
      {elements}
    </div>
  );
};

export default SmartTextRenderer;
