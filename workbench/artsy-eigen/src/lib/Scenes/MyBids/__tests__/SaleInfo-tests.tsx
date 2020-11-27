jest.mock("moment-timezone", () => {
  const CURRENT_TIME = "2020-07-31T05:21:14+00:00"
  const TIME_ZONE = "America/New_York"
  const actual = jest.requireActual("moment-timezone")
  const momentMock = (time: string) => (!!time ? actual(time) : actual(CURRENT_TIME))
  momentMock.tz = { guess: () => TIME_ZONE }

  return momentMock
})

import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import moment from "moment-timezone"
import { Text } from "palette"
import { BoltFill, Stopwatch } from "palette/svgs/sf"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { SaleInfo } from "../Components/SaleInfo"

const renderText = (node: React.ReactElement) => extractText(renderWithWrappers(node).root)

interface SaleInfoProps {
  liveStartAt?: string | null
  endAt?: string | null
  status?: string | null
}

const saleFixture: (overrides: SaleInfoProps) => SaleInfoProps = (overrides = {}) =>
  merge(
    {
      status: "open",
    },
    overrides
  )

// CURRENT_TIME above is "2020-07-31T05:21:14+00:00"
describe("<SaleInfo />", () => {
  describe("live sale", () => {
    it("has a lightning bolt", () => {
      expect(
        renderWithWrappers(
          <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T15:00:00+00:00" })} />
        ).root.findAllByType(BoltFill).length
      ).toEqual(1)
    })

    describe("live bidding in progress", () => {
      let tree: ReactTestRenderer
      beforeEach(() => {
        const liveStartAt = moment().subtract(5, "minutes").toJSON()
        tree = renderWithWrappers(<SaleInfo sale={saleFixture({ liveStartAt, status: "open" })} />)
      })
      it("has a purple100 icon + note if live bidding is active, black60 otherwise", () => {
        expect(tree.root.findByType(BoltFill).props.fill).toMatch("purple100")
      })
      it("has purple100 text", () => {
        expect(tree.root.findByType(Text).props.color).toEqual("purple100")
      })
      it("has no line 2 text", () => {
        expect(tree.root.findAllByType(Text).length).toEqual(1)
      })
    })
    describe("time bounds", () => {
      it("displays 'today' and time (with no second line) if the sale goes live on the same day but more than 10 hours away", () => {
        const text = renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T18:00:00+00:00" })} />)

        expect(text).toEqual("Live bidding begins today at 2:00pm")
      })

      it("displays an additional timely message in hours the sale is within 10 hours", () => {
        const text = renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T12:00:00+00:00" })} />)

        expect(text).toContain("Live bidding begins today at 8:00am")
        expect(text).toContain("Opens in 6 hours")
      })

      it("displays an additional timely message in minutes if the sale is within 1 hour", () => {
        const subject = <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T06:00:00+00:00" })} />
        const tree = renderWithWrappers(subject)
        const text = renderText(subject)

        const lines = tree.root.findAllByType(Text)
        expect(lines.length).toEqual(2)
        expect(lines[1].props.color).toEqual("yellow100")

        expect(text).toContain("Live bidding begins today at 2:00am")
        expect(text).toContain("Opens in 38 minutes")
      })

      it("displays 'Live bidding begins today' and time if the live sale begins on the same calendar day", () => {
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T15:00:00+00:00" })} />)).toContain(
          "Live bidding begins today at 11:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T16:00:00+00:00" })} />)).toContain(
          "Live bidding begins today at 12:00pm"
        )
      })

      it("displays 'Live bidding begins tomorrow' and time if the sale goes live on the following calendar day", () => {
        // This case might be a little counter-intuitive to a user, but it is technically correct
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T04:45:00+00:00" })} />)).toEqual(
          "Live bidding begins tomorrow at 12:45am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T05:00:00+00:00" })} />)).toEqual(
          "Live bidding begins tomorrow at 1:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T15:00:00+00:00" })} />)).toEqual(
          "Live bidding begins tomorrow at 11:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T16:00:00+00:00" })} />)).toEqual(
          "Live bidding begins tomorrow at 12:00pm"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T17:00:00+00:00" })} />)).toEqual(
          "Live bidding begins tomorrow at 1:00pm"
        )
      })

      it("displays 'Live bidding begins at' and date if the sale goes live after tomorrow", () => {
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-07T15:00:00+00:00" })} />)).toEqual(
          "Live bidding begins at 11:00am on 8/7"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-02T15:00:00+00:00" })} />)).toEqual(
          "Live bidding begins at 11:00am on 8/2"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-02T16:00:00+00:00" })} />)).toEqual(
          "Live bidding begins at 12:00pm on 8/2"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ liveStartAt: "2020-08-02T17:00:00+00:00" })} />)).toEqual(
          "Live bidding begins at 1:00pm on 8/2"
        )
      })
    })
  })

  describe("timed auction", () => {
    it("has a little stopwatch", () => {
      expect(
        renderWithWrappers(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T15:00:00+00:00" })} />).root.findAllByType(
          Stopwatch
        ).length
      ).toBe(1)
    })
    describe("time bounds", () => {
      it("displays 'today' and time (with no second line) if the sale goes live on the same day but more than 10 hours away", () => {
        const text = renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T18:00:00+00:00" })} />)

        expect(text).toEqual("Closes today at 2:00pm")
      })

      it("displays an additional timely message in hours the sale is within 10 hours", () => {
        const text = renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T12:00:00+00:00" })} />)

        expect(text).toContain("Closes today at 8:00am")
        expect(text).toContain("Ends in 6 hours")
      })

      it("displays an additional timely message in minutes if the sale is within 1 hour", () => {
        const subject = <SaleInfo sale={saleFixture({ endAt: "2020-07-31T06:00:00+00:00" })} />
        const tree = renderWithWrappers(subject)
        const text = renderText(subject)

        const lines = tree.root.findAllByType(Text)
        expect(lines.length).toEqual(2)
        expect(lines[1].props.color).toEqual("yellow100")
        expect(text).toContain("Closes today at 2:00am")
        expect(text).toContain("Ends in 38 minutes")
      })

      it("displays 'Closes today' and time if the sale closes on the same calendar day", () => {
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T15:00:00+00:00" })} />)).toContain(
          "Closes today at 11:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T16:00:00+00:00" })} />)).toContain(
          "Closes today at 12:00pm"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T17:00:00+00:00" })} />)).toContain(
          "Closes today at 1:00pm"
        )
      })

      it("displays 'Closes tomorrow' and time if the sale closes on the following calendar day", () => {
        // This case might be a little counter-intuitive to a user, but it is technically correct
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T04:45:00+00:00" })} />)).toEqual(
          "Closes tomorrow at 12:45am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T05:00:00+00:00" })} />)).toEqual(
          "Closes tomorrow at 1:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T15:00:00+00:00" })} />)).toEqual(
          "Closes tomorrow at 11:00am"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T16:00:00+00:00" })} />)).toEqual(
          "Closes tomorrow at 12:00pm"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T17:00:00+00:00" })} />)).toEqual(
          "Closes tomorrow at 1:00pm"
        )
      })

      it("displays 'Closes at' and full date if the sale closes in more than 48 hours", () => {
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T15:00:00+00:00" })} />)).toEqual(
          "Closes at 11:00am on 8/2"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T16:00:00+00:00" })} />)).toEqual(
          "Closes at 12:00pm on 8/2"
        )
        expect(renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T17:00:00+00:00" })} />)).toEqual(
          "Closes at 1:00pm on 8/2"
        )
      })
    })
  })
})
