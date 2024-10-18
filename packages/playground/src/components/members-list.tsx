import React, { useState } from 'react'
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  Separator,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  Spacer
} from '@harnessio/canary'
import { getInitials } from '../utils/utils'
import { FormEditDialog } from './form-member-edit-dialog'

interface MembersProps {
  display_name: string
  role: string
  email: string
  timestamp?: string
  avatarUrl?: string
}

interface PageProps {
  members: MembersProps[]
}

export const MembersList = ({ members }: PageProps) => {
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false)
  const [editMember, setEditMember] = useState<MembersProps | null>(null) // Store member being edited

  // Open the edit dialog for a specific member
  const openEditDialog = (member: MembersProps) => {
    setEditMember(member)
    setIsDialogEditOpen(true)
  }

  // Close the edit dialog
  const closeEditDialog = () => {
    setIsDialogEditOpen(false)
    setEditMember(null)
  }

  const handleRoleSave = (newRole: string) => {
    if (editMember) {
      console.log(`Role for ${editMember.display_name} has been updated to ${newRole}`)
      setIsDialogEditOpen(false) // Close dialog after save
    }
  }

  const moreActionsTooltip = ({ member }: { member: MembersProps }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Tooltip open={isOpen} onOpenChange={open => setIsOpen(open)} delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="xs" onClick={() => setIsOpen(true)}>
            <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="shadow-sm py-2 bg-primary-background border border-gray-800 rounded-[10px]">
          <div className="w-[180px]">
            <Button
              theme="muted"
              className="bg-transparent w-full hover:bg-tertiary-background/5 justify-start"
              onClick={() => openEditDialog(member)}>
              <Icon name="edit-pen" className="mr-2" />
              Edit
            </Button>
            <Separator className="w-full h-px bg-tertiary-background/10" orientation="horizontal" decorative={true} />
            <Button
              theme="error"
              className="bg-transparent w-full hover:bg-tertiary-background/5 justify-start"
              onClick={() => setIsDialogDeleteOpen(true)}>
              <Icon name="trash" className="mr-2" />
              Remove Member
            </Button>
          </div>
          {/* FormEditDialog for Role Editing */}
          {isDialogEditOpen && (
            <FormEditDialog member={member} onSave={handleRoleSave} onClose={() => setIsDialogEditOpen(false)} />
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  const FormDeleteMemberDialog = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    // Delete project handler
    const handleDelete = () => {
      setIsDeleting(true)
      setTimeout(() => {
        setIsDeleting(false)
        setDeleteSuccess(true) // Mark deletion as successful
        setTimeout(() => {
          setIsDialogDeleteOpen(false) // Close the dialog
        }, 2000)
      }, 2000)
    }

    return (
      // <form onSubmit={handleDelete}>
      //   <FormFieldSet.Root box shaded>
      //     <FormFieldSet.ControlGroup>
      <AlertDialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
        <AlertDialogTrigger asChild>
          {/* <Button size="sm" theme="error" className="self-start">
                  Remove member
                </Button> */}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove your member.</AlertDialogDescription>
          </AlertDialogHeader>
          <Spacer size={3} />
          <AlertDialogFooter>
            {!isDeleting && !deleteSuccess && (
              <AlertDialogCancel onClick={() => setIsDialogDeleteOpen(false)}>Cancel</AlertDialogCancel>
            )}
            {deleteSuccess ? (
              <Button size="default" theme="success" className="self-start pointer-events-none">
                Member removed&nbsp;&nbsp;
                <Icon name="tick" size={14} />
              </Button>
            ) : (
              <Button size="default" theme="error" className="self-start" onClick={handleDelete}>
                {isDeleting ? 'Removing Member...' : 'Yes, remove Member'}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      //     </FormFieldSet.ControlGroup>
      //   </FormFieldSet.Root>
      // </form>
    )
  }

  // cosnt FormEditMemberDialog = () => {

  // }
  return (
    <>
      <Table variant="asStackedList" className="border-0">
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Name</TableHead>
            <TableHead className="text-primary">Role</TableHead>
            <TableHead className="text-primary">Email</TableHead>
            {members[0]?.timestamp && <TableHead className="text-right text-primary">Date added</TableHead>}
            <TableHead>
              <></>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members &&
            members.map((member, index) => {
              return (
                <TableRow key={index}>
                  {/* NAME */}
                  <TableCell className="content-center my-6">
                    <div className="flex items-center gap-4">
                      <Avatar size="10">
                        {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                        <AvatarFallback className="text-xs p-1 text-center">
                          {getInitials(member.display_name, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                        {member.display_name}
                      </Text>
                    </div>
                  </TableCell>
                  {/* ROLE */}
                  <TableCell className="content-center my-6">
                    <div className="flex gap-1.5 items-center">
                      <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                        <Badge
                          variant="outline"
                          size="xs"
                          className="rounded-full font-normal text-xs p-2 h-5 text-tertiary-background text-center m-auto bg-tertiary-background/10">
                          {member.role}
                        </Badge>
                      </Text>
                    </div>
                  </TableCell>
                  {/* EMAIL */}
                  <TableCell className="content-center my-6">
                    <div className="flex gap-1.5">
                      <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                        {member.email}
                      </Text>
                    </div>
                  </TableCell>
                  {/* DATE ADDED */}
                  {member.timestamp && (
                    <TableCell className="content-center">
                      <div className="flex gap-1.5 items-center justify-end">
                        <Text wrap="nowrap" size={1} truncate className="text-tertiary-background text-right">
                          {member.timestamp}
                        </Text>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="content-center my-6">
                    <div className="flex gap-1.5 items-center justify-end">{moreActionsTooltip({ member })}</div>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      {isDialogDeleteOpen && <FormDeleteMemberDialog />}
      {/* Edit Dialog */}
      {isDialogEditOpen && editMember && (
        <FormEditDialog member={editMember} onSave={handleRoleSave} onClose={closeEditDialog} />
      )}
    </>
  )
}
