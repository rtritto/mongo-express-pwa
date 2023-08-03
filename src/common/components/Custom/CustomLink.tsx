import { Button, ButtonProps } from '@mui/material'
import Link, { LinkProps } from 'next/link.js'
import { forwardRef, Ref } from 'react'

type LinkRef = HTMLButtonElement
type NextLinkProps = Omit<ButtonProps, 'href'> &
  Pick<LinkProps, 'href' | 'as' | 'prefetch' | 'locale'>

// https://gist.github.com/kachar/028b6994eb6b160e2475c1bb03e33e6a
const NextLink = ({ href, as, prefetch, locale, style, ...props }: LinkProps, ref: Ref<LinkRef>) => (
  <Link href={href} as={as} prefetch={prefetch} locale={locale} style={style} passHref>
    <Button ref={ref} {...props} />
  </Link>
)

export default forwardRef<LinkRef, NextLinkProps>(NextLink)