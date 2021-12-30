// https://github.com/EnCiv/undebate-ssp/issues/10

import React, { useState } from 'react'

import { ScriptTextInput } from '../app/components/script_text_input'

export default {
    title: 'Script Text Input',
    component: ScriptTextInput,
    argTypes: {},
}

const Template = args => {
    const [validity, setValidity] = useState({ valid: false, value: '' })
    return (
        <div>
            <ScriptTextInput {...args} onDone={v => setValidity(v)} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {validity.value}</p>
        </div>
    )
}

export const ScriptTextInputTest = Template.bind({})

ScriptTextInputTest.args = {
    questionNumber: 1,
    questionName: 'Moderator welcomes the viewers and asks the candidates to introduce themselves.',
    maxWordCount: 600,
    wordsPerMinute: 100,
    defaultValue:
        'Neque a massa nulla tortor quam. Eget massa facilisis tortor dui ullamcorper enim, quis enim. Neque mi elementum, blandit laoreet. Arcu ut id tortor diam malesuada. Adipiscing eros, nec amet nulla condimentum enim tempor. Non sed interdum convallis bibendum morbi sagittis feugiat aliquet. Tempor ut massa purus et nec nulla. Nulla vitae turpis quis aliquam ornare nisi etiam. In dui amet viverra aliquet neque. Nunc ut felis ridiculus nec convallis. Vitae molestie augue malesuada nulla cursus ut donec quisque tincidunt. ”Et non non sem ac a, sapien. Sed tellus senectus magna” lectus eu habitant. Viverra iaculis ac sagittis amet, pellentesque duis eget etiam. Mattis sed dictum id turpis. Egestas sagittis, facilisis scelerisque mattis. Adipiscing tortor, pretium sed egestas convallis ultrices nec. ”Feugiat pretium semper lorem integer bibendum.” Viverra ut purus amet purus odio lobortis facilisis id diam. Convallis mi porttitor accumsan non hac et nisl. Mus amet non nec mattis massa.',
}
