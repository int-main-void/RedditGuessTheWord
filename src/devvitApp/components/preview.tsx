import {Devvit} from '@devvit/public-api'
import { backgroundColor } from '../../shared/palette.js'

export function Preview(): JSX.Element {
    return  (
    <vstack 
      height="100%" 
      width="100%" 
      alignment="middle center"
      backgroundColor={backgroundColor}
    >
        <text size="large">Loading ...</text>
    </vstack>
    )

}