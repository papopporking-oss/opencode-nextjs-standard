export default function Page() {
  return (
    <main className="w-full flex-1 bg-neutral-content">
      
      {/* Responsive card grid, 1 column on mobile, 2 on md, 3 on lg, 4 on xl, 5 on 2xl */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 m-2">

        {/* Extra small card with title, description, and a right aligned action button */}
        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

      </div>

      {/* Second responsive card grid with the same breakpoint layout as the first one */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 m-2">

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Xsmall Card</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
