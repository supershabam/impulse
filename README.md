impulse
=======

## app state

- user : null or User object
- view : ['cards', 'login', 'settings']
- impulses : [Impulse] - starred view, queue view
- drawer : ['left', 'main', 'right']

```javascript
bus.on('logout', function() {
  app.setState({user: null})
})
bus.on('login', function(user) {
  app.setState({user: user})
})
bus.on('toggleDrawerLeft', function() {
  if (app.state.drawer === 'left') {
    app.setState({drawer: 'main'})
  } else {
    app.setState({drawer: 'left'})
  }
})
bus.on('view', function(view) {
  app.setState({drawer: 'main', view: view})
})
```

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

