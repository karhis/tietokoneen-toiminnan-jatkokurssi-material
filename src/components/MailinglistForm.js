import React from 'react'
import styled from 'styled-components'

import { TextField, Button } from '@material-ui/core'

const Container = styled.div`
  padding: 3rem;
`

const FieldContainer = styled.div`
  width: 100%;
  display: flex;
  height: 2.5rem;

  button {
    background-color: #22a7f0;
    color: white;
    border: 0;
    padding: 0 1rem;
    font-weight: bold;
    transition: all 0.2s;
    height: 3.5rem !important;
    margin-left: 0.5rem;
    &:hover {
      cursor: pointer;
      background-color: #4183d7;
    }
  }
`

export default class MailingListForm extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }
  render() {
    return (
      <Container>
        <h2>Muistuta minua kun kurssi alkaa</h2>
        <form
          action="https://mooc.us8.list-manage.com/subscribe/post?u=db82662e446284fd41bd8370e&amp;id=21c004aa9c"
          method="post"
          name="mc-embedded-subscribe-form"
          target="_blank"
          noValidate
          id="mailingListForm"
          ref={this.form}
        >
          <FieldContainer>
            <TextField
              variant="outlined"
              type="text"
              label="Sähköpostiosoite"
              fullWidth
              name="EMAIL"
            />
            <Button
              onClick={() => {
                this.form.current.submit()
              }}
            >
              Tilaa
            </Button>
          </FieldContainer>
        </form>
      </Container>
    )
  }
}