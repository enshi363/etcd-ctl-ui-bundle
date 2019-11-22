package main

import "errors"

var (
	ERROR_TOKEN_INVALID = errors.New("Couldn't handle this token")

	ERROR_TOKEN_TIME_INVALID = errors.New("Token is either expired or not active yet")
)
