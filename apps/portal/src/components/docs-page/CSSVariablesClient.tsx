import { useState, useMemo } from "react";
import { Table, Text, SearchInput, Layout } from "@harnessio/ui/components";

interface Variable {
  name: string;
  value: string;
  category: string;
  subcategory: string;
}

interface CSSVariablesClientProps {
  allVariables: Variable[];
}

export const CSSVariablesClient = ({
  allVariables,
}: CSSVariablesClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVars = useMemo(() => {
    if (!searchQuery) return allVariables;

    const query = searchQuery.toLowerCase();
    return allVariables.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.value.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query) ||
        v.subcategory.toLowerCase().includes(query),
    );
  }, [allVariables, searchQuery]);

  const groupedVars = useMemo(() => {
    const grouped: Record<string, Record<string, Variable[]>> = {};

    filteredVars.forEach((v) => {
      if (!grouped[v.category]) {
        grouped[v.category] = {};
      }
      if (!grouped[v.category][v.subcategory]) {
        grouped[v.category][v.subcategory] = [];
      }
      grouped[v.category][v.subcategory].push(v);
    });

    return grouped;
  }, [filteredVars]);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="my-cn-xl">
        <SearchInput
          placeholder="Search variables by name, value, or category..."
          value={searchQuery}
          onChange={setSearchQuery}
          debounce={false}
        />
      </div>

      {/* Variables Container */}
      <Layout.Vertical gap="2xl">
        {Object.entries(groupedVars).map(([category, subcategories]) => (
          <section key={category}>
            <Text variant="heading-section" as="h2" className="mb-cn-lg">
              {category}
            </Text>
            <Layout.Vertical gap="xl">
              {Object.entries(subcategories).map(([subcategory, vars]) => {
                if (vars.length === 0) return null;

                return (
                  <div key={subcategory} className="w-full">
                    <Text
                      variant="heading-subsection"
                      as="h3"
                      className="mb-cn-md"
                    >
                      {subcategory}
                    </Text>

                    <Table.Root
                      size="normal"
                      className="w-full"
                      tableClassName="w-full table-fixed"
                    >
                      <Table.Header>
                        <Table.Row>
                          <Table.Head className="w-[500px] !pl-cn-md">
                            Variable Name
                          </Table.Head>
                          <Table.Head className="w-[500px]">Value</Table.Head>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {vars.map((v) => (
                          <Table.Row key={v.name}>
                            <Table.Cell>
                              <Text
                                variant="body-single-line-code"
                                className="!border-0 !p-0 !pl-cn-md"
                              >
                                {v.name}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text
                                variant="body-single-line-code"
                                className="!border-0 !p-0"
                              >
                                {v.value}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </div>
                );
              })}
            </Layout.Vertical>
          </section>
        ))}
      </Layout.Vertical>
    </div>
  );
};
