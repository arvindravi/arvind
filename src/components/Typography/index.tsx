import styled, { css } from 'styled-components'
import defaultTheme from '../Theme'


// captures the interaction on <Larr /> and <Rarr /> components
const arrows = css`
  &:hover {
    .rightArrow {
      opacity: 1;
      transform: translateX(8px);
      transition: transform ${defaultTheme.animations.default};
    }

    .leftArrow {
      opacity: 1;
      transform: translateX(-8px);
      transition: transform ${defaultTheme.animations.default};
    }
  }
`

const heading = css`
  font-weight: ${defaultTheme.fontWeights.heading};
  color: ${props => props.theme.text.primary};
  line-height: ${defaultTheme.lineHeights.heading};

  ${arrows}
`

export const h1 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[6]};
  letter-spacing: -0.6px;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[5]};
  }
`
export const H1 = styled.h1`
  ${h1};
`

export const h2 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[5]};
  letter-spacing: -0.6px;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[4]};
  }
`
export const H2 = styled.h2`
  ${h2};
`

export const h3 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[4]};
  letter-spacing: -0.6px;
`
export const H3 = styled.h3`
  ${h3};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[3]};
  }
`

export const h4 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[3]};
`
export const H4 = styled.h4`
  ${h4};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[2]};
  }
`

export const h5 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[2]};
`
export const H5 = styled.h5`
  ${h5};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[1]};
  }
`

export const h6 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[1]};
`
export const H6 = styled.h6`
  ${h6};
  font-weight: ${defaultTheme.fontWeights.bold};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[1]};
  }
`

export const p = css`
  font-size: ${defaultTheme.fontSizes[3]};
  font-weight: ${defaultTheme.fontWeights.body};
  line-height: ${defaultTheme.lineHeights.body};
  color: ${props => props.theme.text.secondary};

  a {
    color: ${props => props.theme.text.primary};
    text-decoration: underline solid ${props => props.theme.border.default};
  }

  a:hover {
    text-decoration: underline solid ${props => props.theme.text.primary};
  }

  & + & {
    margin-top: ${defaultTheme.space[4]};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[2]};
  }
`
export const P = styled.p`
  ${p};
`

export const blockquote = css`
  ${p};
  margin-top: ${defaultTheme.space[5]};
  padding-left: ${defaultTheme.space[4]};
  font-style: italic;
  color: ${props => props.theme.text.tertiary};
  display: block;
  position: relative;

  &:before {
    content: '';
    height: 100%;
    width: 4px;
    border-radius: 4px;
    background: ${props => props.theme.border.opaque};
    position: absolute;
    left: 0;
  }
`
export const Blockquote = styled.blockquote`
  ${blockquote};
`

export const list = css`
  margin: ${defaultTheme.space[4]};
  margin-left: ${defaultTheme.space[5]};
  font-size: ${defaultTheme.fontSizes[3]};
  font-weight: ${defaultTheme.fontWeights.body};
  line-height: ${defaultTheme.fontWeights.body};
  color: ${props => props.theme.text.secondary};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[2]};
  }
`
export const Ul = styled.ul`
  ${list};
`

export const Ol = styled.ol`
  ${list};
`

export const listItem = css`
  line-height: ${defaultTheme.lineHeights.heading};
  padding: ${defaultTheme.space[1]} ${defaultTheme.space[0]};
`
export const Li = styled.li`
  ${listItem}
`

export const pre = css`
  ${p};
  font-size: ${defaultTheme.fontSizes[2]}!important;
  font-family: ${defaultTheme.fonts.monospace}!important;
  padding: ${defaultTheme.space[3]}!important;
  background: ${props => props.theme.bg.inset}!important;
  text-shadow: none!important;
  border-radius: 8px;
  margin: ${defaultTheme.space[4]} 0!important;

  code {
    padding: ${defaultTheme.space[2]};
    line-height: ${defaultTheme.lineHeights.code};;
  }
`
export const Pre = styled.pre`
  ${pre};
`

export const code = css`
  ${p};
  font-family: ${defaultTheme.fonts.monospace}!important;
  font-size: ${defaultTheme.fontSizes[2]}!important;
  padding:  ${defaultTheme.space[1]} ${defaultTheme.space[2]}!important;
  background: ${props => props.theme.bg.inset}!important;
  border-radius: 8px;
  display: inline-block;
  background: ${props => props.theme.bg.inset}!important;
  text-shadow: none!important;

  .token.operator {
    background: none!important;
  }
`
export const Code = styled.code`
  ${code};
`

export const Hr = styled.hr``

export const A = styled.a`
  ${arrows}
`

const baseArrowStyles = css`
  position: relative;
  display: inline-block;
  opacity: 0.4;
  transition: all ${defaultTheme.animations.default};
  font-weight: ${defaultTheme.fontWeights.subheading};
`

export const Rarr = styled.span.attrs({
  children: '→',
  className: 'rightArrow'
})`
  opacity: 0.4;
  ${baseArrowStyles};
`

export const Larr = styled.span.attrs({
  children: '←',
  className: 'leftArrow'
})`
  transform: translateX(-4px);
  ${baseArrowStyles};
`

export const Subheading = styled(P)`
  font-weight: ${defaultTheme.fontWeights.subheading};
  margin-top: ${defaultTheme.space[2]};

  & + & {
    margin-top: ${defaultTheme.space[3]};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
    margin-top: ${defaultTheme.space[2]};
  }
`;