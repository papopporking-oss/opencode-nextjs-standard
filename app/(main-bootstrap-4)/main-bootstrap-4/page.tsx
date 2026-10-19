import styles from './style.module.css'

import Button from 'react-bootstrap/Button';

export default function Page() {
  return (
    <main className={styles.blog}>
      <div>
        main
      </div>
      <div>
        <label>
          Username:
          </label>
      </div>
      <div>
        <input type="text" placeholder="Enter your name"></input>
      </div>
      <div>
        <button type="button">Click</button>
      </div>
      <div>
        <Button variant="primary">Primary</Button>{' '}
        <Button variant="secondary">Secondary</Button>{' '}
        <Button variant="success">Success</Button>{' '}
        <Button variant="warning">Warning</Button>{' '}
        <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
        <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
        <Button variant="link">Link</Button>
      </div>
    </main>
  );
}
