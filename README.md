impulse
=======

## schemas

### impulse

An impulse is a single item that a user can dismiss or like. A user will flip through many of these.

```javascript
{
  id: String,
  image: String,
  title: String,
  description: String
}
```

### user

This is the user object.

```javascript
{
  id: String,
  location: [lat, long]
}
```

### kept

This is a collection of impulses

```javascript
{
  impulseId: String,
  userId: String,
  when: Numeric unix timestamp
}
```

## actions

`view impulse`

`dismiss impulse`

`keep impulse`

