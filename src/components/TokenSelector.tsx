import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import Select from 'react-select'

import { TokenDetails } from 'types'
import TokenImg from './TokenImg'
import { FormatOptionLabelContext } from 'react-select/src/Select'

const TokenImgWrapper = styled(TokenImg)`
  width: 4em;
  height: 4em;

  margin-right: 0.25em 2em 0.25em 1em;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin: 0em 1em;

  label {
    text-transform: uppercase;
    padding-left: 8px; // to align with Select input padding
  }

  input {
    margin-left: 0; // to fix extra space on Select search box
  }

  .optionItem {
    display: flex;
    align-items: center;

    > div {
      display: flex;
      flex-direction: column;
      margin-left: 1em;
    }
  }
`

function renderOptionLabel(token: TokenDetails): React.ReactNode {
  return (
    <div className="optionItem">
      <TokenImgWrapper src={token.image} alt={token.name} />
      <div>
        <div>
          <strong>{token.symbol}</strong>
        </div>
        <div>{token.name}</div>
      </div>
    </div>
  )
}

function formatOptionLabel(
  options: { token: TokenDetails },
  labelMeta: { context: FormatOptionLabelContext },
): React.ReactNode {
  const { token } = options
  const { context } = labelMeta
  return context === 'value' ? <strong>{token.symbol}</strong> : renderOptionLabel(token)
}

const customSelectStyles = {
  control: (provided: CSSProperties): CSSProperties => ({ ...provided, border: 'none' }),
  menu: (provided: CSSProperties): CSSProperties => ({ ...provided, minWidth: '300px' }),
  valueContainer: (provided: CSSProperties): CSSProperties => ({ ...provided, minWidth: '4.5em' }),
}

interface Props {
  label?: string
  isDisabled?: boolean
  tokens: TokenDetails[]
  selected: TokenDetails
  onChange: (selected: TokenDetails) => void
}

const TokenSelector: React.FC<Props> = ({ label, isDisabled, tokens, selected, onChange }) => {
  const options = useMemo(() => tokens.map(token => ({ token, value: token.symbol, label: token.name })), [tokens])

  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Select
        isSearchable
        isDisabled={isDisabled}
        styles={customSelectStyles}
        noOptionsMessage={(): string => 'No results'}
        formatOptionLabel={formatOptionLabel}
        options={options}
        value={{ token: selected }}
        onChange={(selected, { action }): void => {
          if (action === 'select-option' && 'token' in selected) {
            onChange(selected.token)
          }
        }}
      />
    </Wrapper>
  )
}

export default TokenSelector