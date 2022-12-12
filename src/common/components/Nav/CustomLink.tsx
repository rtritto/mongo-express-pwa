import React, { forwardRef, Ref } from 'react'
import Link, { LinkProps } from 'next/link.js'
import { Button, ButtonProps } from '@mui/material'

type LinkRef = HTMLButtonElement
type NextLinkProps = Omit<ButtonProps, 'href'> &
  Pick<LinkProps, 'href' | 'as' | 'prefetch' | 'locale'>

const NextLink = ({ href, as, prefetch, locale, style, ...props }: LinkProps, ref: Ref<LinkRef>) => (
  <Link href={href} as={as} prefetch={prefetch} locale={locale} style={style} passHref>
    <Button ref={ref} {...props} />
  </Link>
)

export default forwardRef<LinkRef, NextLinkProps>(NextLink)