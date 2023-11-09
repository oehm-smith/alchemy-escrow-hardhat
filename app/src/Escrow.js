export default function Escrow({
                                   address,
                                   arbiter,
                                   beneficiary,
                                   value,
                                   date,
                                   handleApprove,
                                   status
                               }) {
    const buttonMarkup = (() => {
        switch (status) {
            case "approved":
                return (
                    <div
                        className="complete"
                        id={address}
                    >
                        ✓ It's been approved!
                    </div>
                );
            case "deployed":
                return (
                    <div
                        className="button"
                        id={address}
                        onClick={(e) => {
                            e.preventDefault();

                            handleApprove();
                        }}
                    >
                        Approve
                    </div>
                );
            default:
                throw new Error(`Unknown status: ${status}`);
        }
    })();
    return (
        <div className="existing-contract">
            <ul className="fields">
                <li>
                    <div> Date</div>
                    <div> {date} </div>
                </li>
                <li>
                    <div> Arbiter</div>
                    <div> {arbiter} </div>
                </li>
                <li>
                    <div> Beneficiary</div>
                    <div> {beneficiary} </div>
                </li>
                <li>
                    <div> Value</div>
                    <div> {value} </div>
                </li>
                {buttonMarkup}

            </ul>
        </div>
    );
}
