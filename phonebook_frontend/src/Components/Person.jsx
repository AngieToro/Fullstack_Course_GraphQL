const Person = ( { person, onClose }) => {

    return (
        <div>
            <h2>
                 <strong> Name: </strong> 
                 { person.name } 
            </h2>
            <div>
                <strong> Address </strong> 
                { person.address.street } { person.address.city } 
            </div>
            <div>
                <strong>Phone</strong> 
                { person.phone || 'No phone available' } 
            </div>
            <button onClick={ onClose }>
                Close
            </button>
        </div>
    )


}

export default Person