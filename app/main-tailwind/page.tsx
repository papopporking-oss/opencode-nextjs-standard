import styles from './style.module.css'

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
    </main>
  );
}
