package main

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"time"
)

type AuthMiddleWare struct {
	Secret []byte
}

var authMiddleware = &AuthMiddleWare{
	Secret: Env.GetSecretKey(),
}

func (auth *AuthMiddleWare) Verify() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Athorization")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("AllYourBase"), nil
		})
		if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
			c.Set("user.name", claims.Issuer)
			c.Set("user.password", claims.Subject)

		} else if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				c.AbortWithError(401, ERROR_TOKEN_INVALID)
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				// Token is either expired or not active yet
				c.AbortWithError(401, ERROR_TOKEN_TIME_INVALID)
			} else {
				c.AbortWithError(401, ERROR_TOKEN_INVALID)
			}
		} else {
			c.AbortWithError(401, ERROR_TOKEN_INVALID)
		}
		c.Next()
	}
}

func (auth *AuthMiddleWare) MakeCredential(username, subject string) (tokenString string, err error) {

	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(7200 * time.Second).Unix(),
		NotBefore: time.Now().Add(-5 * time.Minute).Unix(),
		IssuedAt:  time.Now().Unix(),
		Issuer:    username,
		Subject:   subject,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(auth.Secret)
	return
}
