
import { Button, TextInput } from "flowbite-react";
import { useState } from "react";



const SearchBar = () => {
    const [search, setSearch] = useState('')

    const handleSearchResult = (e) => {
        e.preventDefault();
        console.log(search)
    }

    return (
        <>

            <form onSubmit={handleSearchResult} className="flex flex-row justify-center w-[50%] m-auto">
                <div className="w-[70%]">
                    <label htmlFor="search" className="sr-only">Search</label>
                    
                    <TextInput id="search" type="search" placeholder="Find the latest blogs" required onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                </div>
                <Button type="submit" className="w-[30%]" gradientDuoTone="greenToBlue">Search</Button>
            </form>

        </>
    )
}

export { SearchBar }