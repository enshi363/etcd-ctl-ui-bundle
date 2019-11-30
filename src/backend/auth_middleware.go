package main

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type MyClaims struct {
	Endpoints []string `json:"endpoints"`
	jwt.StandardClaims
}

type AuthMiddleWare struct {
	Secret []byte
}

var authMiddleware = &AuthMiddleWare{
	Secret: Env.GetSecretKey(),
}

func (auth *AuthMiddleWare) Verify() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithError(401, ERROR_TOKEN_INVALID)
			return
		}
		token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
			return auth.Secret, nil
		})
		if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
			//c.Set("user.name", claims.StandardClaims.Issuer)
			//c.Set("user.password", claims.StandardClaims.Subject)
			//c.Set("user.endpoints", claims.Endpoints)
			client, err := NewEtcdClient(claims.StandardClaims.Issuer, claims.StandardClaims.Subject, claims.Endpoints)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
				return
			}
			c.Set("etcdClient", client)

		} else if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				c.JSON(http.StatusUnauthorized, gin.H{"error": ERROR_TOKEN_INVALID.Error()})
				return
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				// Token is either expired or not active yet
				c.JSON(http.StatusUnauthorized, gin.H{"error": ERROR_TOKEN_TIME_INVALID.Error()})
				return
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": ERROR_TOKEN_INVALID.Error()})
				return
			}
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": ERROR_TOKEN_INVALID.Error()})
			return
		}
		c.Next()
	}
}

func (auth *AuthMiddleWare) MakeCredential(username, subject string, endpoints []string) (tokenString string, err error) {

	claims := MyClaims{
		endpoints,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(86400 * time.Second).Unix(),
			NotBefore: time.Now().Add(-5 * time.Minute).Unix(),
			IssuedAt:  time.Now().Unix(),
			Issuer:    username,
			Subject:   subject,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(auth.Secret)
	return
}
