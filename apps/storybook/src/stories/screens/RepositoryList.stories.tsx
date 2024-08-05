import React from 'react'
import Container from '../../components/layout/container'
import { GitnessNavbar } from '../components/NavBar.stories'
import { GitnessTopBar } from '../components/TopBar.stories'
import { GitPullRequest, GitFork, Star } from '@harnessio/icons-noir'
import View from '../../components/layout/View'
import Section from '../../components/layout/Section'
import EntityList from '../composites/EntityList'
import { EntityListPagination } from './widgets/EntityListPagination'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@harnessio/canary'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export default {
  title: 'Screens/Repository List',
  parameters: {
    layout: 'fullscreen'
  }
}

const repos = [
  {
    id: '1',
    name: 'drone',
    description: 'Continuous Integration platform powered by Docker',
    private: false,
    stars: 0,
    forks: 0,
    pulls: 12
  },
  {
    id: '1',
    name: 'drone-go',
    description: 'Go client for the Drone API',
    private: false,
    stars: 0,
    forks: 0,
    pulls: 5
  },
  {
    id: '1',
    name: 'go-generate',
    description: 'Package generate provides tools for generating pipeline configuration files in the Drone format.',
    private: true,
    stars: 2,
    forks: 1,
    pulls: 22
  },
  {
    id: '1',
    name: 'go-task',
    private: false,
    stars: 3,
    forks: 1,
    pulls: 7
  },
  {
    id: '1',
    name: 'go-scm',
    description: 'Package scm provides a unified interface to multiple source code management systems.',
    private: true,
    stars: 123,
    forks: 16,
    pulls: 56
  },
  {
    id: '1',
    name: 'go-convert',
    description: 'Package convert provides tools for converting pipeline configuration files to the Drone format.',
    private: true,
    stars: 0,
    forks: 0,
    pulls: 1
  }
]

export function RepositoryList() {
  return (
    <Container.Root>
      <Container.Sidebar>
        <GitnessNavbar />
      </Container.Sidebar>
      <Container.Main>
        <Container.Topbar>
          <GitnessTopBar />
        </Container.Topbar>
        <Container.Content>
          <View.Root>
            <Section.Root firstSection>
              <Section.Header>
                <p className="section-title">Repositories</p>
              </Section.Header>
              <EntityList.Root>
                <EntityList.Header>
                  <EntityList.Actions>
                    <EntityList.ActionItem>
                      <Input
                        type="search"
                        placeholder="Search ..."
                        className="flex w-full mr-3 leading-4 rounded-lg bg-secondary-background placeholder:text-tertiary-background"
                      />
                    </EntityList.ActionItem>
                    <EntityList.ActionItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="group text-tertiary-background select-none">
                          <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
                            Filter&nbsp;
                            <ChevronDownIcon className="entity-list-action-chevron" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="font-light text-xs">Filter option 1</DropdownMenuItem>
                          <DropdownMenuItem className="font-light text-xs">Filter option 2</DropdownMenuItem>
                          <DropdownMenuItem className="font-light text-xs">Filter option 3</DropdownMenuItem>
                          <DropdownMenuItem className="font-light text-xs">Filter option 4</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </EntityList.ActionItem>
                    <EntityList.ActionItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="group text-tertiary-background select-none">
                          <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
                            Sort&nbsp;
                            <ChevronDownIcon className="entity-list-action-chevron" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="font-light text-xs">Sort option 1</DropdownMenuItem>
                          <DropdownMenuItem className="font-light text-xs">Sort option 2</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </EntityList.ActionItem>
                    <EntityList.ActionItem>
                      <Button variant="default" size="sm" className="ml-6">
                        New Repository
                      </Button>
                    </EntityList.ActionItem>
                  </EntityList.Actions>
                </EntityList.Header>
                <EntityList.Content>
                  <div className="border rounded-md w-full">
                    <Table>
                      <TableBody>
                        {repos.map(repo => (
                          <TableRow className="flex">
                            <TableCell className="flex flex-col flex-1 gap-1 px-4 py-3">
                              <div>
                                <p className="inline font-normal text-primary">{repo.name}</p>
                                <Badge
                                  className={`select-none bg-transparent rounded-2xl text-[12px] font-light ml-2.5 py-1 px-2 leading-none text-[#71dbd3] border-[#1d3333] bg-[#111c1d] hover:bg-inherit ${
                                    repo.private && 'border-[#242428] bg-[#151518] text-[#93939f]'
                                  }`}>
                                  {repo.private ? 'Private' : 'Public'}
                                </Badge>
                              </div>
                              <div className="flex gap-2 text-xs  text-tertiary-background">
                                <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-96">
                                  {repo.description || <i>No Description</i>}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="flex flex-col gap-1 px-4 py-3.5 justify-end">
                              <div className="whitespace-nowrap text-[12px] select-none font-light">
                                <span className="mr-1 text-tertiary-background">Updated</span>
                                <span className="text-primary">2 hours ago</span>
                              </div>
                              <div className="flex gap-2 justify-end text-[12px] select-none font-light">
                                <span className="flex gap-1 items-center">
                                  <Star className="text-tertiary-background" strokeWidth="1.5" />
                                  <span className="text-primary">{repo.stars}</span>
                                </span>
                                <span className="flex gap-1 items-center">
                                  <GitFork className=" text-tertiary-background" strokeWidth="1.5" />
                                  <span className="text-primary">{repo.forks}</span>
                                </span>
                                <span className="flex gap-1 items-center">
                                  <GitPullRequest className="text-tertiary-background" strokeWidth="1.5" />
                                  <span className="text-primary">{repo.pulls}</span>
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </EntityList.Content>
                <EntityList.Footer>
                  <EntityListPagination />
                </EntityList.Footer>
              </EntityList.Root>
            </Section.Root>
          </View.Root>
        </Container.Content>
      </Container.Main>
    </Container.Root>
  )
}
