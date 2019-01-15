# Getting Started

Run the following from the root folder:

```
cd src && npm install
```

# Motivation

This was one of the first [React](https://reactjs.org/) projects I made. It was buggy, confusing, and not fun to look at. I've now revisited it after learning more about best practices.
Technically speaking, it's a small exploration of [material-ui](https://material-ui.com/) and [Jest](https://jestjs.io/).

The app purpose is to see how many episodes of a series you would have to watch until you're near the series rating. Extra information about the series is supplied but toggled off, so you don't get spoiled and can choose how much information is presented to you.

# Thoughts / Improvements

I opted to have a sort of "master component" in the form of `Landing.tsx` in lieu of using a state management tool. There's a lot of logic packed in, so it's possible some should be moved out to a separate component.
