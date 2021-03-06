# DAHLIA Partners

A portal for leasing agents, sales agents, and developers to manage listings and applications.

[![Maintainability](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/maintainability)](https://codeclimate.com/github/SFDigitalServices/sf-dahlia-lap/maintainability)

Only showing rspec tests for now:
[![Test Coverage](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/test_coverage)](https://codeclimate.com/github/SFDigitalServices/sf-dahlia-lap/test_coverage)

Cross-browser testing done with <a href="https://www.browserstack.com/"><img src="./Browserstack-logo@2x.png?raw=true" height="36" ></a>

## Setup
* Use Ruby 2.7.0 (Set the version using [RVM](https://rvm.io/rvm/install) or [rbenv](https://github.com/rbenv/rbenv))
* Install [Bundler](https://github.com/bundler/bundler) for this version of Ruby `gem install bundler -v 2.1.2`
* Use Node v12.16.x (npm v6.13.4)
* Install Yarn (if you have Homebrew you can run `brew install yarn`)
* Run `yarn install`
* Run `bundle install`
  - see [here](https://stackoverflow.com/a/19850273/260495) if you have issues installing `pg` gem with Postgres.app, you may need to use: `gem install pg -v 0.21.0 -- --with-pg-config=/Applications/Postgres.app/Contents/Versions/latest/bin/pg_config`
  - if you need to run this command make sure you run `bundle install` again following the success of the postgres installation to install the remaining gems
* Run `overcommit --install`
* Create a `.env` file in the root directory and ask a team member for access to the local development secrets
* Setup your local database by running `bin/rails db:migrate RAILS_ENV=development`

### VSCode setup
We recommend you use VSCode to develop partners. You can use something else, but you're on your own for setting up linting/autocomplete.

#### Installing recommended VSCode extensions
Open the partners projects in VSCode, click the extensions tab and filter by recommended extensions, install the extensions under "Workspace recommendations"

#### Configuring VSCode and extensions
Necessary configs are defined in [.vscode/settings.json](.vscode/settings.json). you can override those configs or change additional settings by changing the apps user settings (Code -> Preferences -> Settings or using the shortcut `CMD + ,`)

## To run server
* `yarn start`
* Access the app at [http://localhost:3000/](http://localhost:3000/)

## To update CSS from Pattern Library
* Checkout your desired commit in your local copy of the [sf-dahlia-pattern-library](https://github.com/SFDigitalServices/sf-dahlia-pattern-library)
* Run `npm start` in your pattern lib directory
* In a separate tab, change to the partners directory and run `grunt`

## Linting
To lint Ruby code run: `rubocop`

To lint the React code run: `yarn lint`

To fix any auto-fixable linting errors run: `yarn lint:fix`

## Visual Studio setup
Install the following extensions:
- [EsLint](https://github.com/Microsoft/vscode-eslint)
- [Prettier](https://github.com/prettier/prettier-vscode)

To automatically fix linting errors on save, add this to your VSCode workspace settings:
```
"editor.codeActionsOnSave": {
    // For ESLint
    "source.fixAll.eslint": true,
},
```


## Rails tests

### Running tests

`bundle exec rake spec`

**Updating VCR Cassettes**

If the Salesforce API changes for a request, or if the data sent to the API for a request has changed, you have to update the VCR cassettes affected. Cassettes are YAML files located in the `app/spec/vcr/` directory.

In order to update the cassettes you have to:

* Go to your failing test.
* Locate the instruction that is creating the cassette with `VCR.use_cassette`.
* Remove the cassette specified from `app/spec/vcr/`

For example, for:
```
VCR.use_cassette('listings/applications_controller/index') do
```

You have to remove:
```
app/spec/vcr/listings/applications_controller/index.yml
```

Then re-run your test. **Be aware that now that request in your test will actually be run.** A new cassette will be automatically generated recording that new run of the request, and then subsequent runs of the test will use that recorded cassette for the request.

## React/Javascript tests

### Running unit tests

`yarn unit`

**Updating snapshots**

If you made a legitimate change in the view and a snapshot fails then you have to tell Jest to update the snapshots. Run:

`yarn unit -u`

_Note: Snapshots should be pushed to the repo_

### Running e2e tests

To view the e2e tests as they're running, set `HEADLESS` to `false` in [this file](https://github.com/SFDigitalServices/sf-dahlia-lap/blob/main/spec/javascript/support/puppeteer/consts.js)

**Run server**

Run your Rails server locally in port 3000:

`bundle exec rails server -p 3000`

Run your webpack server locally

`bin/webpack-dev-server --hot`

**Run tests**

`yarn e2e`


### Running all or individual tests

To run all tests (unit and e2e):

`yarn test:all`

To run an individual test:

`yarn test:all path/to/test`

### Writing component unit tests
#### General best practices
1. Use [Enzyme](https://enzymejs.github.io/enzyme/docs/api/shallow.html)’s shallow rendering instead of react-test-renderer.create or Enzyme mount for all unit tests (snapshot and otherwise).
   * There are some cases where you’ll need to use mount instead of shallow, like when you need to test componentDidMount functionality or something
2. Snapshot tests are fine for very simple components, but for anything more complex we should write actual unit tests instead of (or along with) snapshot tests

For more information on why shallow rendering is simpler than full rendering, check out the comments on [this pr](https://github.com/SFDigitalServices/sf-dahlia-lap/pull/386).

#### Shallow vs. Mount explained
Say you have two components `<A />` and `<B />`:
```
const B = ({ className }) => (
  <div className={className || 'BClass'} />
)

const A = ({}) => (
  <div>
    <B className='AClass' />
  </div>
)
```

`mount(<A />)` would create a snapshot that looks like this:
```
  <div>
    <div className='AClass' />
  </div>
```

`shallow(<A />)` would create a snapshot that looks like this:
```
  <div>
    <B className='AClass' />
  </div>
```

Shallow rendering is preferred because the snapshot is simpler, and it ensures you're actually writing a unit test, not a test that will search the whole tree.

##### When do you need to use mount rendering?
- When you need to test functionality of `componentDidMount`
- When you actually want to write an end-to-end snapshot test that looks at all of the children
  - There are usually better tests to write than this if you have the time
- When it's less confusing than adding a bunch of `.dive().dive()`'s to your tests
  - For example, if you wanted to check that react-final-form adds the correct error label to an input, it's usually easier to mount render and find the class, rather than traverse the shallow render tree with a whole bunch of dive()s.

#### Unit testing components with form or context
Shallow rendering is more complicated when you're using connected components, that are wrapped with useContext or work with [react-final-form](https://final-form.org/docs/react-final-form/getting-started)'s form objects.

The [wrapperUtil.js](spec/javascript/testUtils/wrapperUtil.js) contains utils to help with shallow rendering components that use context or form.

##### Example: shallow rendering a component that has a form passed in
Say you want to test a component that looks like this:
```
const ComponentThatUsesForm = ({ form }) => (
  <div>
    <ComponentA someProp={form.something} />
    <ComponentB />
  <div/>
)
```

You can test it like:
```
import { withForm } from 'spec/javascript/testUtils/wrapperUtil.js'
import ComponentA from '...'

test('it renders ComponentA', () => {
  const application = { id: 'appid', <some other application fields>}

  const wrapper = withForm(application, (form) => <ChildThatNeedsForm form={form} />)

  expect(wrapper.find(ComponentA)).toHaveLength(1)
})
```

##### Example: shallow rendering a component that uses form and context
Say you want to test a component that looks like this:
```
const ComponentThatUsesFormAndContext = ({ form, store }) => {

  return (
    <div>
      <ComponentA somePropA={form.something} />
      <ComponentB somePropB={store.contextField} />
    <div/>
  )
}

export withContext(ComponentThatUsesFormAndContext)
```

You can test it like:
```
import { shallowWithFormAndContext } from 'spec/javascript/testUtils/wrapperUtil.js'
import ComponentA from '...'

test('it renders ComponentA', () => {
  // Note that the context object must have an application on it, because form expects an application.
  const context = {
    application: { id: 'appid', <some other application fields>}
  }

  const wrapper = shallowWithFormAndContext(
    context,
    (form) => <ComponentThatUsesFormAndContext form={form} />
  )

  expect(wrapper.find(ComponentA)).toHaveLength(1)
})
```

#### Example files that follow these best practices
- Non-form component: [StatusHistoryContainer.test.js](spec/javascript/components/molecules/lease_up_sidebar/StatusHistoryContainer.test.js)
- Form-component: [RentalAssistance.test.js](spec/javascript/components/supplemental_application/sections/RentalAssistance.test.js)

## Scripts

### Release scripts
More documentation for how these scripts are used during a release in the [partners release process doc](https://sfgovdt.jira.com/wiki/spaces/HOUS/pages/1900544029/Partners+Release+processes+template).

#### 1. create_release_branch
Command: `yarn create_release_branch`

This script will:
- Create a new branch named `release-<todays-date>`
- Merge it with the latest main
- Open a PR in a browser window

#### 2. print_release_info
Command: `yarn print_release_info -u <github-username> -t <github-access-token>`

Instructions for how to get your github access token are printed by running `yarn print_release_info -h`

This script will:
- Print release tracker info you can paste into the [Release Tracker doc](https://docs.google.com/spreadsheets/d/1EUvw2ugaFprt8FxlCUa1yWATSn0KKo4FyRfBJWUwE3M/edit#gid=1500049656)
- Output a URL that will create a draft release with description, title, tags, and base branch filled in

## Debugging

You can debug all tests and Rails server in VS code.
Go to debug view (⇧+⌘+D on Mac)
From the dropdown in left top corner pick what you want to debug:
- Rails server: for running app
- Jest: for any javascript test
- Rspec: for ruby tests

For tests you can debug a single file or the whole suite. To enter debug click a breakpoint (red dot) left side to line number of the file you want to debug and run the test with play button. In the debug console you can run any function to check the expected outcome. Also adding watch expressions is very helpful. You can use the bar that popups to jump to next lines of code, into the functions or continue.

### Debugging Javascript

To debug javascript, run Rails server in the prefered way. Go to browser and open inspector (⌥+⌘+I). Go to Sources tab and press ⌘+P to search for a file that you want to debug eg. PaperApplicationForm. Click line number to set a breakpoint in the place you want to debug. You can also add watch expressions, step into or over lines like in VS code debugger.

## React Hooks
Wanted to post a basic intro to react hooks here as they will make our code more performant and allow us to use more functional components. I have examples below but you can read more on the [React Documentation](https://reactjs.org/docs/hooks-overview.html)

### useState, useEffect, and useRef Hooks
These hooks are all built-in to react by default.

`useState` allows functional components to manage state just like a class component but with a streamlined syntax.
```js
// class version
class Dropdown extends React.Component {
  state = {
    expanded: false
  }

  expandDropdown = () => {
    this.setState({ expanded: true })
  }
}

// hooks version
const Dropdown = () => {
  const [expanded, setExpanded] = useState(false)

  const expandDropdown = () => {
    setExpanded(true)
  }
}
```
These components now have the exact same level of control over the expanded flag but the below function has less overhead when mounting and unmounting.

`useEffect` is the hook that allows us to still take advantage of lifecycle events when necessary.
```js
const Dropdown = ({ styles }) => {
  // The empty array passed as the second param here
  // allows for this function to only fire once on
  // mount. This is the hooks version of componentDidMount
  useEffect(() => {
    loadData()
  }, [])
  // The prop passed in the array as the second param here
  // allows for this function to fire once on
  // mount and then anytime that prop changes. You can
  // add more than one prop to a given effect and it will
  // fire when any of those props changes. This is the hooks
  // version of componentDidUpdate
  useEffect(() => {
    updateStyles()
  }, [styles])
}
```

`useRef` allows us access to the `ref` prop of any tag in a component just like a normal ref is assigned. The syntax for the hook is simpler than the old way.

```js
// old version
wrapperRef = null
render() {
  return (
    <div ref={(node) => this.wrapperRef = node }>
      // other stuff
    </div>
  )
}

// hooks version
const wrapperRef = useRef(null)
return (
  <div ref={wrapperRef}>
    // other stuff
  </div>
)
```