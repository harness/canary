import figlet from 'figlet'
import { summer } from 'gradient-string'

export function harnessLog() {
  console.log('\n')
  figlet(
    'Harness Design System!!',
    {
      font: 'Big',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 120,
      whitespaceBreak: true
    },
    function (err, data) {
      if (err) {
        console.log('Something went wrong...')
        console.dir(err)
        return
      }
      console.log(summer(data))
    }
  )
}
