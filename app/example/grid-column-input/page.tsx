export default function Page() {
  return (
    <main className="w-full flex-1 bg-base-300">
      
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 m-2">

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <input type="text" placeholder="Type here" className="input" />
            <input type="text" placeholder="Type here" className="input" />
            <select defaultValue="Pick a color" className="select">
              <option disabled={true}>Pick a color</option>
              <option>Crimson</option>
              <option>Amber</option>
              <option>Velvet</option>
            </select>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">What is your name?</legend>
              <input type="text" className="input" placeholder="Type here" />
              <p className="label">Optional</p>
            </fieldset>
            <textarea className="textarea" placeholder="Bio"></textarea>
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Login options</legend>
              <label className="label">
                <input type="checkbox" defaultChecked className="toggle" />
                Remember me
              </label>
            </fieldset>
            <input type="file" className="file-input" />
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Login options</legend>
              <label className="label">
                <input type="checkbox" defaultChecked className="checkbox" />
                Remember me
              </label>
            </fieldset>
            <input type="date" className="input" />
            <input type="time" className="input" />
            <input type="datetime-local" className="input" />
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Action</button>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
