import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
// import { JsonWebTokenError } from 'jsonwebtoken'
export function middleware(request) { 
    const cookieStore = cookies()
    const token = cookieStore.get('jwtoken')
  if (request.nextUrl.pathname.startsWith('/register')) {
    
    if (token) {
       return NextResponse.redirect(new URL('/login',request.url))
    }

    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith('/mylist')) {
    const cookieStore = cookies()
    const token = cookieStore.get('jwtoken')
    if (!token) {
       return NextResponse.redirect(new URL('/login',request.url))
    }

    return NextResponse.next();
  }
  // if (request.nextUrl.pathname.startsWith('/mylist')) {
  //   const cookieStore = cookies()
  //   const token = cookieStore.get('jwtoken')
  //   const token_value = token.value;
  //   // console.log( "This is the token value:",token.value)
  //   if (token) {
  //     try {
  //       // const decoded = jwt.verify(token_value, process.env.ACCESS_TOKEN_SECRET);
  //       // const user = decoded.user;
  //       // console.log("Decoded email:", user);
  //       console.log("token is availbale");
  //       // request.headers.set('x-email', user);  // Add email to request headers
  //     } catch (error) {
  //       console.log(error)
  //       return NextResponse.redirect(new URL('/login', request.url));
  //     }
  //   } else {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  // }
 
  return NextResponse.next();
}